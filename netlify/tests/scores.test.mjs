import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { blobFetch } from './blob-fixture.mjs';
import { handleScores } from '../lib/scores.mjs';
import { config } from '../functions/scores.mjs';

const TEST_PIN = '1234';
const URL = 'https://scores.example/.netlify/functions/scores';
const entry = (overrides = {}) => ({
  id: randomUUID(), winner: 'Arnt', loser: 'Ola', points: 2, ...overrides,
});
const request = (method = 'GET', data, pin = TEST_PIN, headers = {}) => new Request(URL, {
  method, headers: { 'X-Scores-Pin': pin, 'Content-Type': 'application/json', ...headers },
  body: data === undefined ? undefined : JSON.stringify(data),
});

// Deterministic compare-and-swap store for exercising simultaneous writers.
class MemoryStore {
  value = null;
  revision = 0;
  forceConflict = false;
  async getWithMetadata() {
    return this.value ? { data: structuredClone(this.value), etag: String(this.revision) } : null;
  }
  async setJSON(key, value, options) {
    assert.equal(key, 'scoreboard');
    if (options.onlyIfNew ? this.value !== null : this.forceConflict || options.onlyIfMatch !== String(this.revision)) {
      return { modified: false };
    }
    this.value = structuredClone(value);
    return { modified: true, etag: String(++this.revision) };
  }
}
async function call(store, method, data, expected = 200, pin = TEST_PIN, headers) {
  const response = await handleScores(request(method, data, pin, headers), store, TEST_PIN);
  assert.equal(response.status, expected, await response.clone().text());
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  return response.json();
}

test('initializes all six server scores once and validates PIN before storage access', async () => {
  const store = new MemoryStore();
  await call(store, 'GET', undefined, 401, '9999');
  assert.equal(store.value, null);
  const initial = await call(store, 'GET');
  assert.deepEqual(initial.results.map(({ winner, loser, points }) => [winner, loser, points]), [
    ['Arnt', 'Ola', 18], ['Arnt', 'Ørjan', 5], ['Ørjan', 'Arnt', 6],
    ['Ørjan', 'Ola', 16], ['Ola', 'Arnt', 22], ['Ola', 'Ørjan', 4],
  ]);
  assert.deepEqual(await call(store, 'GET'), initial);
  assert.equal(store.revision, 1);
  await call(store, 'GET', undefined, 403, TEST_PIN, { Origin: 'https://another.example' });
  await call(store, 'GET', undefined, 200, TEST_PIN, { Origin: 'https://scores.example' });
  assert.equal((await handleScores(request(), store, undefined)).status, 503);
  assert.equal(config.rateLimit.action, 'rate_limit');
});

test('add, retry, undo and retry-after-undo never duplicate or restore points', async () => {
  const store = new MemoryStore(), result = entry();
  await call(store, 'POST', result);
  assert.equal((await call(store, 'POST', result)).results.length, 7);
  await call(store, 'POST', { ...result, points: 3 }, 409);
  await call(store, 'DELETE', { id: 'seed-0' }, 400);
  assert.equal((await call(store, 'DELETE', { id: result.id })).results.length, 6);
  assert.equal((await call(store, 'DELETE', { id: result.id })).results.length, 6);
  assert.equal((await call(store, 'POST', result)).results.length, 6);
});

test('simultaneous updates are merged with conditional writes', async () => {
  const store = new MemoryStore();
  const first = entry(), second = entry({ winner: 'Ola', loser: 'Ørjan' });
  await Promise.all([call(store, 'POST', first), call(store, 'POST', second)]);
  const saved = await call(store, 'GET');
  assert.equal(saved.results.length, 8);
  assert(saved.results.some(row => row.id === first.id));
  assert(saved.results.some(row => row.id === second.id));
  await call(store, 'DELETE', { id: saved.results.at(-2).id }, 409);
  assert.equal((await call(store, 'GET')).results.length, 8);
});

test('idempotent concurrent requests and imports preserve original timestamps', async () => {
  const store = new MemoryStore();
  const old = entry({ at: Date.parse('2026-09-10T10:00:00Z') });
  await Promise.all([call(store, 'POST', old), call(store, 'POST', old)]);
  assert.equal((await call(store, 'GET')).results.length, 7);
  assert.equal((await call(store, 'GET')).results.at(-1).at, old.at);
});

test('a valid Ola-Arnt score from an older client is accepted even when its clock is ahead', async () => {
  const store = new MemoryStore();
  const result = entry({ winner: 'Ola', loser: 'Arnt', points: 1, at: Date.now() + 60000 });
  const saved = await call(store, 'POST', result);
  assert.equal(saved.results.filter(row => row.winner === 'Ola' && row.loser === 'Arnt')
    .reduce((total, row) => total + row.points, 0), 23);
});

test('new scores use server time, and a later retry keeps the original timestamp', async () => {
  const store = new MemoryStore();
  const result = entry({ winner: 'Ola', loser: 'Arnt', points: 1, at: undefined });
  const before = Date.now();
  const saved = (await call(store, 'POST', result)).results.at(-1);
  assert(saved.at >= before && saved.at <= Date.now());
  await new Promise(resolve => setTimeout(resolve, 10));
  const retried = await call(store, 'POST', result);
  assert.equal(retried.results.length, 7);
  assert.deepEqual(retried.results.at(-1), saved);
  await call(store, 'POST', { ...result, points: 2 }, 409);
  await call(store, 'DELETE', { id: result.id });
  assert.equal((await call(store, 'POST', result)).results.length, 6);
});

test('invalid results, too-large totals and oversized bodies are rejected without changing scores', async () => {
  const store = new MemoryStore();
  const initial = await call(store, 'GET');
  for (const bad of [
    { winner: 'Ola', loser: 'Ola' }, { winner: '<script>' }, { points: 0 }, { points: -1 }, { points: 1.5 },
    { points: Number.MAX_SAFE_INTEGER }, { points: Number.MAX_SAFE_INTEGER + 1 },
    { at: -1 }, { at: null }, { at: 'invalid' }, { at: 8640000000000001 },
    { id: 'seed-forged' }, { id: '../../bad' },
  ]) await call(store, 'POST', entry(bad), 400);
  await call(store, 'POST', entry({ unused: 'x'.repeat(3000) }), 413);
  await call(store, 'PUT', entry(), 405);
  assert.deepEqual(await call(store, 'GET'), initial);
});

test('storage failure or corruption never returns fabricated defaults', async () => {
  const store = new MemoryStore();
  const originalError = console.error;
  console.error = () => {};
  try {
    store.value = { broken: true };
    await call(store, 'GET', undefined, 500);
    assert.deepEqual(store.value, { broken: true });
    store.getWithMetadata = async () => { throw Error('Storage offline'); };
    await call(store, 'GET', undefined, 500);
  } finally { console.error = originalError; }
});

test('exhausted write conflicts return a retryable error without losing saved results', async () => {
  const store = new MemoryStore();
  const initial = await call(store, 'GET');
  store.forceConflict = true;
  await call(store, 'POST', entry(), 409);
  assert.deepEqual(await call(store, 'GET'), initial);
});

test('missing storage ETag never becomes an unconditional overwrite', async () => {
  const store = new MemoryStore();
  await call(store, 'GET');
  const original = structuredClone(store.value);
  store.getWithMetadata = async () => ({ data: structuredClone(store.value) });
  const originalError = console.error;
  console.error = () => {};
  try {
    await call(store, 'POST', entry(), 500);
    assert.deepEqual(store.value, original);
  } finally { console.error = originalError; }
});

test('Netlify Blobs SDK: independent clients and reopened disk fixture retain shared scores', async () => {
  const root = resolve('.netlify');
  await mkdir(root, { recursive: true });
  const directory = await mkdtemp(join(root, 'scores-test-'));
  const client = () => getStore({
    name: 'backgammon', siteID: 'test-site', token: 'local-test-only',
    edgeURL: 'https://cached.example', uncachedEdgeURL: 'https://strong.example',
    consistency: 'strong', fetch: (url, options) => {
      assert.equal(new globalThis.URL(url).origin, 'https://strong.example');
      return blobFetch(directory)(url, options);
    },
  });
  try {
    const first = client(), second = client(), result = entry();
    await call(first, 'POST', result);
    assert.equal((await call(second, 'GET')).results.at(-1).id, result.id);
    await call(second, 'POST', result);
    assert.equal((await call(first, 'GET')).results.length, 7);
    assert.equal((await call(client(), 'GET')).results.length, 7);
    const extra = [entry(), entry()];
    await Promise.all(extra.map(row => call(client(), 'POST', row)));
    assert.equal((await call(client(), 'GET')).results.length, 9);
    await call(client(), 'DELETE', { id: (await call(client(), 'GET')).results.at(-1).id });
    await call(client(), 'DELETE', { id: (await call(client(), 'GET')).results.at(-1).id });
    await call(client(), 'DELETE', { id: result.id });
    assert.equal((await call(client(), 'GET')).results.length, 6);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
