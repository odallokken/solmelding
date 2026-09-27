import { createHash, timingSafeEqual } from 'node:crypto';

const PLAYERS = ['Arnt', 'Ola', 'Ørjan'];
const KEY = 'scoreboard';
const ID = /^[a-zA-Z0-9-]{1,80}$/;
const START = [
  ['Arnt', 'Ola', 18], ['Arnt', 'Ørjan', 5], ['Ørjan', 'Arnt', 6],
  ['Ørjan', 'Ola', 16], ['Ola', 'Arnt', 22], ['Ola', 'Ørjan', 4],
];

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function initial() {
  return { version: 1, results: START.map(([winner, loser, points], index) => ({
    id: `seed-${index}`, winner, loser, points, at: 0, seed: true,
  })), deleted: [] };
}

function validEntry(entry) {
  return entry && typeof entry.id === 'string' && ID.test(entry.id)
    && PLAYERS.includes(entry.winner) && PLAYERS.includes(entry.loser) && entry.winner !== entry.loser
    && Number.isSafeInteger(entry.points) && entry.points > 0
    && Number.isSafeInteger(entry.at) && entry.at >= 0 && entry.at <= 8640000000000000;
}

function validate(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.results) || !Array.isArray(data.deleted)) {
    throw new Error('Invalid stored scoreboard');
  }
  const ids = new Set();
  const sums = new Map(PLAYERS.map(name => [name, 0]));
  for (const entry of [...data.results, ...data.deleted]) {
    if (!validEntry(entry) || ids.has(entry.id) || typeof entry.seed !== 'boolean'
        || (!entry.seed && entry.id.startsWith('seed-'))) throw new Error('Invalid stored result');
    ids.add(entry.id);
  }
  const expectedSeeds = initial().results;
  if (expectedSeeds.some((seed, index) => Object.entries(seed).some(([key, value]) => data.results[index]?.[key] !== value))
      || data.results.slice(6).some(entry => entry.seed) || data.deleted.some(entry => entry.seed)) {
    throw new Error('Invalid starting scores');
  }
  for (const entry of data.results) sums.set(entry.winner, sums.get(entry.winner) + entry.points);
  if ([...sums.values()].some(sum => !Number.isSafeInteger(sum))) {
    throw new HttpError(400, 'Poengsummen er for stor.');
  }
}

async function read(store) {
  let entry = await store.getWithMetadata(KEY, { type: 'json', consistency: 'strong' });
  if (!entry) {
    await store.setJSON(KEY, initial(), { onlyIfNew: true });
    entry = await store.getWithMetadata(KEY, { type: 'json', consistency: 'strong' });
  }
  if (!entry || typeof entry.etag !== 'string' || !entry.etag) throw new Error('Scoreboard initialization failed');
  validate(entry.data);
  return entry;
}

async function body(request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) {
    throw new HttpError(415, 'Resultatet må sendes som JSON.');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'Resultatet mangler.');
  let size = 0;
  const chunks = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 2048) {
      await reader.cancel();
      throw new HttpError(413, 'Resultatet er for stort.');
    }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new HttpError(400, 'Ugyldig JSON.'); }
}

function apply(data, method, input) {
  if (method === 'POST') {
    const existing = [...data.results, ...data.deleted].find(entry => entry.id === input.id);
    if (existing) {
      if (existing.winner !== input.winner || existing.loser !== input.loser
          || existing.points !== input.points || existing.at !== input.at) {
        throw new HttpError(409, 'Denne registreringen finnes allerede med andre verdier.');
      }
      return false;
    }
    data.results.push({ ...input, seed: false });
  } else {
    if (data.deleted.some(entry => entry.id === input.id)) return false;
    const last = data.results[data.results.length - 1];
    if (last.seed || last.id !== input.id) {
      throw new HttpError(409, 'Poengene er endret. Oppdater tavlen før du angrer siste registrering.');
    }
    data.deleted.push(data.results.pop());
  }
  validate(data);
  return true;
}

// The store is injected so the same handler can be tested without a Netlify account.
export async function handleScores(request, store, pin) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  try {
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(request.url).origin) throw new HttpError(403, 'Denne nettsiden har ikke tilgang.');
    if (!/^\d{4}$/.test(pin || '')) throw new HttpError(503, 'Poengtjenesten er ikke ferdig konfigurert.');
    const digest = text => createHash('sha256').update(text).digest();
    if (!timingSafeEqual(digest(request.headers.get('X-Scores-Pin') || ''), digest(pin))) {
      throw new HttpError(401, 'Feil PIN-kode.');
    }
    if (!['GET', 'POST', 'DELETE'].includes(request.method)) throw new HttpError(405, 'Ukjent handling.');
    let input;
    if (request.method !== 'GET') {
      input = await body(request);
      if (!input || typeof input.id !== 'string' || !ID.test(input.id) || input.id.startsWith('seed-')) {
        throw new HttpError(400, 'Ugyldig registrering.');
      }
      if (request.method === 'POST') {
        if (!validEntry(input) || input.at > Date.now()) {
          throw new HttpError(400, 'Velg to forskjellige spillere og et positivt heltall som poeng.');
        }
        input = { id: input.id, winner: input.winner, loser: input.loser, points: input.points, at: input.at };
      }
    }
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data, etag } = await read(store);
      if (request.method === 'GET' || !apply(data, request.method, input)) {
        return new Response(JSON.stringify({ version: 1, results: data.results }), { headers });
      }
      // Conditional writes keep simultaneous phone updates from overwriting each other.
      const saved = await store.setJSON(KEY, data, { onlyIfMatch: etag });
      if (saved.modified) return new Response(JSON.stringify({ version: 1, results: data.results }), { headers });
    }
    throw new HttpError(409, 'Noen andre oppdaterer poengene. Prøv igjen.');
  } catch (error) {
    if (!(error instanceof HttpError)) console.error('Backgammon storage failed:', error);
    return new Response(JSON.stringify({
      error: error instanceof HttpError ? error.message : 'Poengtjenesten er utilgjengelig. Prøv igjen.',
    }), { status: error instanceof HttpError ? error.status : 500, headers });
  }
}
