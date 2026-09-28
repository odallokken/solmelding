import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { handleScores } from '../lib/scores.mjs';

const client = await readFile(new URL('../../backgammon.js', import.meta.url), 'utf8');
const olaClips = ['bravo.mp3', 'det_er_jaevlig_bra.mp3'];
const clips = (await readdir(new URL('../../audio/backgammon/', import.meta.url))).filter(name => !olaClips.includes(name)).sort();
const tick = () => new Promise(resolve => setImmediate(resolve));
const waitFor = async predicate => {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await tick(); }
  throw new Error('Timed out waiting for audio state');
};

class Element {
  value = '';
  hidden = false;
  disabled = false;
  open = true;
  textContent = '';
  dataset = {};
  options = [];
  listeners = {};
  classList = { add() {}, remove() {}, contains() { return false; } };
  addEventListener(name, listener) { this.listeners[name] = listener; }
  async fire(name) { await this.listeners[name]?.({ preventDefault() {} }); }
  replaceChildren(...children) { this.options = children; }
  append() {}
  setAttribute() {}
  removeAttribute() {}
  querySelectorAll() { return []; }
  querySelector() { return new Element(); }
  focus() {}
}

async function setup(t) {
  const elements = new Map();
  const el = id => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  const state = {
    events: [], contexts: [], started: [], clips: [], warnings: [],
    random: 0, failSave: false, failAudio: false, failResume: false,
    loseResponse: false, holdSave: null, holdAudio: null, saved: null, revision: 0,
  };
  const document = { getElementById: el, createElement: () => new Element(), hidden: false, listeners: {},
    addEventListener(name, listener) { this.listeners[name] = listener; },
  };
  class AudioContext {
    state = 'suspended';
    destination = {};
    constructor() { state.contexts.push(this); }
    async resume() {
      state.events.push('resume');
      if (state.failResume) throw new Error('Audio blocked');
      this.state = 'running';
    }
    async close() { this.state = 'closed'; }
    async decodeAudioData() { return { duration: 3 }; }
    createBufferSource() {
      const source = { onended: null, stopped: false, buffer: null, connect() {}, disconnect() {},
        start() { state.started.push(source); }, stop() { source.stopped = true; },
      };
      return source;
    }
  }
  const store = {
    async getWithMetadata() {
      return state.saved ? { data: structuredClone(state.saved), etag: String(state.revision) } : null;
    },
    async setJSON(key, data) {
      state.saved = structuredClone(data);
      return { modified: true, etag: String(++state.revision) };
    },
  };
  const fetch = async (url, options = {}) => {
    if (url.startsWith('audio/')) {
      state.clips.push(url.split('/').at(-1));
      if (state.holdAudio) await state.holdAudio;
      if (state.failAudio) return new Response(null, { status: 404 });
      return new Response(new Uint8Array([1, 2, 3]));
    }
    if (options.method === 'POST') {
      state.events.push('save');
      if (state.holdSave) await state.holdSave;
      if (state.failSave) throw new Error('Storage unavailable');
    }
    const response = await handleScores(new Request('https://scores.example' + url, options), store, '0478');
    if (options.method === 'POST' && state.loseResponse) {
      state.loseResponse = false;
      throw new Error('Response lost after write');
    }
    return response;
  };
  const math = Object.create(Math);
  math.random = () => state.random;
  runInNewContext(client, {
    document, window: { AudioContext }, Element, Option: function(text, value) { this.value = value; },
    Intl, Date, Math: math, AbortController, setTimeout, clearTimeout, fetch,
    crypto: { randomUUID }, localStorage: { getItem() { return null; } },
    console: { warn: (...args) => state.warnings.push(args) },
    solStopMusic() {}, solStopNonnaSpeech() {}, solClaimAudioPlayback() {}, solReleaseAudioPlayback() {},
  });
  t.after(async () => { await el('bgMode').fire('close'); });
  el('bgPin').value = '0478';
  await el('bgPinForm').fire('submit');
  assert.equal(el('bgPinForm').hidden, true);
  const submit = async (winner, points = 1) => {
    el('bgWinner').value = winner;
    el('bgLoser').value = winner === 'Ola' ? 'Arnt' : 'Ola';
    el('bgPointsInput').value = String(points);
    await el('bgResultForm').fire('submit');
  };
  return { state, document, el, submit };
}

test('Arnt and Ørjan randomly use every supplied clip, once per confirmed result, never per point', async t => {
  const { state, submit, el } = await setup(t);
  assert.equal(clips.length, 16);
  for (let index = 0; index < clips.length; index++) {
    state.random = (index + 0.5) / clips.length;
    await submit(index % 2 ? 'Ørjan' : 'Arnt', 3);
    await waitFor(() => state.started.length === index + 1);
    assert.equal(state.saved.results.length, 7 + index);
    assert.equal(el('bgSoundControl').textContent, 'Stopp lyd');
    assert.equal(el('bgResultStatus').textContent.startsWith('Lagret:'), true);
  }
  assert.deepEqual([...state.clips].sort(), clips);
  assert(state.started.slice(0, -1).every(source => source.stopped));
  assert.deepEqual(state.events.slice(0, 2), ['resume', 'save']);
  const last = state.started.at(-1);
  last.onended();
  assert.equal(el('bgSoundControl').hidden, true);
  assert(state.contexts.every(context => context.state === 'closed'));
});

test('Ola wins randomly use only his two clips after confirmation, once regardless of points or retry', async t => {
  for (const clip of olaClips) await readFile(new URL(`../../audio/backgammon/${clip}`, import.meta.url));
  const { state, submit, el } = await setup(t);
  let release;
  state.holdSave = new Promise(resolve => { release = resolve; });
  const pending = submit('Ola', 3);
  await tick();
  assert.equal(state.started.length, 0);
  assert.equal(state.clips.length, 0);
  state.loseResponse = true;
  release();
  await pending;
  assert.equal(state.started.length, 0);
  assert.equal(state.saved.results.length, 7);
  state.holdSave = null;
  await submit('Ola', 3);
  await waitFor(() => state.started.length === 1);
  assert.equal(state.saved.results.length, 7);
  assert.deepEqual(state.clips, ['bravo.mp3']);
  assert.equal(el('bgResultStatus').textContent, 'Lagret: Ola +3 poeng mot Arnt.');
  state.random = 0.99;
  await submit('Ola');
  await waitFor(() => state.started.length === 2);
  assert.deepEqual(state.clips, olaClips);
  assert.equal(state.started[0].stopped, true);
});

test('refresh, imports and undo stay silent', async t => {
  const { state, el } = await setup(t);
  await el('bgRefresh').fire('click');
  const result = { id: randomUUID(), winner: 'Arnt', loser: 'Ola', points: 2, at: Date.now() };
  el('bgImportFile').files = [{ size: 200, text: async () => JSON.stringify({ version: 1, results: [result] }) }];
  await el('bgImportFile').fire('change');
  await el('bgImport').fire('click');
  await el('bgUndo').fire('click');
  assert.equal(state.saved.results.length, 6);
  assert.equal(state.contexts.length, 0);
  assert.equal(state.clips.length, 0);
  assert.equal(state.started.length, 0);
});

test('no clip starts until confirmation; failed saves are silent and retries play only once', async t => {
  const { state, submit, el } = await setup(t);
  let release;
  state.holdSave = new Promise(resolve => { release = resolve; });
  const pending = submit('Arnt');
  await tick();
  assert.equal(state.started.length, 0);
  assert.equal(state.clips.length, 0);
  state.failSave = true;
  release();
  await pending;
  assert.equal(state.started.length, 0);
  assert(state.contexts.every(context => context.state === 'closed'));
  state.failSave = false;
  state.holdSave = null;
  state.loseResponse = true;
  await submit('Arnt');
  assert.equal(state.saved.results.length, 7);
  assert.equal(state.started.length, 0);
  await submit('Arnt');
  await waitFor(() => state.started.length === 1);
  assert.equal(state.saved.results.length, 7);
  await el('bgRefresh').fire('click');
  assert.equal(state.started.length, 1);
});

test('sound errors preserve a successful save and allow audio-only retry', async t => {
  const { state, submit, el } = await setup(t);
  state.failAudio = true;
  await submit('Ørjan');
  await waitFor(() => el('bgSoundControl').textContent === 'Spill av lyd');
  assert.equal(state.saved.results.length, 7);
  assert.equal(el('bgResultStatus').textContent, 'Lagret: Ørjan +1 poeng mot Ola.');
  assert.equal(el('bgSoundStatus').dataset.error, 'true');
  state.failAudio = false;
  await el('bgSoundControl').fire('click');
  await waitFor(() => state.started.length === 1);
  assert.equal(state.saved.results.length, 7);
  assert.equal(state.clips[0], state.clips[1]);
  await el('bgSoundControl').fire('click');
  assert.equal(state.started[0].stopped, true);
  assert.equal(el('bgSoundControl').hidden, true);
});

test('blocked audio never blocks score submission or causes unhandled rejection', async t => {
  const { state, submit, el } = await setup(t);
  state.failResume = true;
  await submit('Arnt');
  await waitFor(() => el('bgSoundControl').textContent === 'Spill av lyd');
  assert.equal(state.saved.results.length, 7);
  assert.equal(state.started.length, 0);
  state.failResume = false;
  await el('bgSoundControl').fire('click');
  await waitFor(() => state.started.length === 1);
  assert.equal(state.saved.results.length, 7);
});

test('closing during save or audio download prevents late playback', async t => {
  for (const stage of ['holdSave', 'holdAudio']) {
    const { state, submit, el } = await setup(t);
    let release;
    state[stage] = new Promise(resolve => { release = resolve; });
    const pending = submit('Arnt');
    await tick();
    el('bgMode').open = false;
    await el('bgMode').fire('close');
    release();
    await pending;
    await tick();
    assert.equal(state.started.length, 0);
    assert(state.contexts.every(context => context.state === 'closed'));
    assert.equal(el('bgSoundControl').hidden, true);
  }
});

test('hiding the page stops sound and returning does not replay it', async t => {
  const { state, document, submit, el } = await setup(t);
  await submit('Arnt');
  await waitFor(() => state.started.length === 1);
  document.hidden = true;
  document.listeners.visibilitychange();
  assert.equal(state.started[0].stopped, true);
  assert.equal(el('bgSoundControl').hidden, true);
  document.hidden = false;
  document.listeners.visibilitychange();
  assert.equal(state.started.length, 1);
});
