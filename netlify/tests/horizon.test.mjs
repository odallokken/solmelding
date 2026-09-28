import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { horizonRuntime, pageFunction } from '../../scripts/update-solhjornet-horizon.mjs';

const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
const mask = JSON.parse(await readFile(new URL('../../solhjornet-buildings.json', import.meta.url), 'utf8'));
const data = JSON.parse(await readFile(new URL('../../solhjornet-horizon.json', import.meta.url), 'utf8'));
const runtime = await horizonRuntime();

function loader(fetch, timers = {}) {
  const messages = [], warnings = [];
  const api = runInNewContext([
    'let solProfile = null, solProfilePromise = null, solProfileError = null, solCalibration = null;',
    'let solProfileSourceDate = "", solTargetDay = "", solBuildingMaskPromise = null;',
    ...['solFetchJSON', 'solLoadBuildingMask', 'solLoadPreparedProfile', 'solEnsureProfile'].map(name => pageFunction(html, name)),
    '({ ensure: solEnsureProfile, state: () => ({profile: solProfile, promise: solProfilePromise,',
    'error: solProfileError, calibration: solCalibration, sourceDate: solProfileSourceDate}) })',
  ].join('\n'), {
    fetch, AbortController, setTimeout, clearTimeout, ...timers,
    solValidateHorizonData: runtime.solValidateHorizonData,
    solCalibrateProfile: runtime.solCalibrateProfile,
    solLoading: text => messages.push(text), solRenderHero() {},
    console: { warn: (...args) => warnings.push(args) },
  });
  return { ...api, messages, warnings };
}
const response = value => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });

test('published horizon preserves the verified raw geometry and both observation references', () => {
  const profile = runtime.solValidateHorizonData(data, mask);
  assert.equal(profile.lat, 59.93413);
  assert.equal(profile.lng, 10.76767);
  assert.equal(profile.eye, 1.7);
  assert.equal(profile.ground, 69.86);
  assert.equal(profile.rays.length, 360);
  // Locks the original, already verified measured profile against accidental regeneration or edits.
  assert.equal(createHash('sha256').update(JSON.stringify(profile)).digest('hex'),
    'a1666addd1a2cd3c674722f6bf3161650fa989c0c7c726cb0e4bf0ca2f28eabe');
  const references = [
    ['2026-09-10', '2026-09-10T17:12:51.097Z', '2026-09-10T18:55:00+02:00'],
    ['2026-09-21', '2026-09-21T16:23:09.220Z', '2026-09-21T18:16:00+02:00'],
  ];
  const calibration = runtime.solCalibrateProfile(profile);
  references.forEach(([date, rawEnd, observedEnd], index) => {
    const result = runtime.computeSunWindows(runtime.solDayStart(Date.parse(date + 'T00:00:00Z')),
      profile.lat, profile.lng, profile);
    assert(Math.abs(result.last - Date.parse(rawEnd)) < 1);
    assert(Math.abs(result.last - calibration[index].offsetMs - Date.parse(observedEnd)) < 1);
  });
  const solar = runtime.solarPosition(Date.parse('2026-09-10T17:56:15.108+02:00'), profile.lat, profile.lng);
  assert(Math.abs(runtime.horizonAt(profile, solar.azimuth) - 6.1958216246) < 1e-8);
});

test('first visit shares two same-origin reads, never samples elevations or accesses browser storage', async () => {
  const requests = [], releases = [];
  const instance = loader((url, { signal }) => {
    assert(!signal.aborted);
    assert(['solhjornet-buildings.json', 'solhjornet-horizon.json'].includes(url));
    requests.push(url);
    return new Promise(resolve => releases.push(() => resolve(response(url.includes('buildings') ? mask : data))));
  });
  const first = instance.ensure(), second = instance.ensure();
  assert.equal(first, second);
  assert.equal(requests.length, 2, 'Both requests should start together');
  assert.equal(instance.state().profile, null);
  releases.forEach(release => release());
  const profile = await first;
  assert.equal((await second), profile);
  assert.equal((await instance.ensure()), profile);
  assert.equal(requests.length, 2);
  assert.equal(instance.state().sourceDate, mask.sourceDate);
  assert.equal(instance.state().promise, null);
  assert.equal(instance.state().calibration.length, 2);
  assert.equal(instance.warnings.length, 0);
});

test('missing or malformed published data fails explicitly and the next attempt can retry', async () => {
  for (const failure of ['missing', 'malformed', 'invalid-json']) {
    let fail = true, requests = 0;
    const instance = loader(async url => {
      if (url.includes('buildings')) return response(mask);
      requests++;
      if (fail) return failure === 'missing' ? new Response(null, { status: 404 })
        : failure === 'invalid-json' ? new Response('<html>Not JSON</html>') : response({ version: 1 });
      return response(data);
    });
    await assert.rejects(instance.ensure(), failure === 'invalid-json' ? SyntaxError
      : new RegExp(failure === 'missing' ? 'sol-horizon-missing' : 'sol-horizon-invalid'));
    assert.equal(instance.state().profile, null);
    assert.equal(instance.state().promise, null);
    assert(instance.state().error);
    assert.equal(instance.warnings.length, 1);
    fail = false;
    assert.equal((await instance.ensure()).rays.length, 360);
    assert.equal(instance.state().error, null);
    assert.equal(requests, 2);
  }
});

test('an eight-second deadline includes response body loading and resets for retry', async () => {
  for (const [asset, stage] of ['buildings', 'horizon'].flatMap(asset =>
    ['headers', 'body'].map(stage => [asset, stage]))) {
    let fail = true, aborted = false;
    const instance = loader(async (url, { signal }) => {
      if (!fail || !url.includes(asset)) return response(url.includes('buildings') ? mask : data);
      const blocked = () => new Promise((resolve, reject) => signal.addEventListener('abort', () => {
        aborted = true; reject(new Error('Aborted fixture request'));
      }, { once: true }));
      return stage === 'headers' ? blocked() : { ok: true, json: blocked };
    }, {
      setTimeout(callback, milliseconds) { assert.equal(milliseconds, 8000); return setTimeout(callback, 5); },
    });
    await assert.rejects(instance.ensure(), /sol-data-timeout/);
    assert(aborted);
    assert.equal(instance.state().profile, null);
    assert.equal(instance.state().promise, null);
    fail = false;
    assert.equal((await instance.ensure()).ground, 69.86);
  }
});

test('incorrect coordinates, height, building version, dates or ray data are never accepted', () => {
  const mutations = [
    value => { value.version = 2; },
    value => { value.sourceDate = '2020-01-01'; },
    value => { value.profile.lat += .00001; },
    value => { value.profile.lng += .00001; },
    value => { value.profile.eye = 2.7; },
    value => { value.profile.variant = 'surface'; },
    value => { value.profile.variant = 'buildings-0000000000000000'; },
    value => { value.profile.ground = null; },
    value => { value.profile.eyeZ += 1; },
    value => { value.profile.builtAt = null; },
    value => { value.profile.rays.pop(); },
    value => { value.profile.rays[0].alt = null; },
    value => { value.profile.rays[0].alt = 91; },
    value => { value.profile.rays[0].dist = -1; },
    value => { value.profile.rays[0].src = 'tree'; },
  ];
  mutations.forEach(mutate => {
    const invalid = structuredClone(data);
    mutate(invalid);
    assert.throws(() => runtime.solValidateHorizonData(invalid, mask), /sol-horizon-invalid/);
  });
});
