import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

export function pageFunction(html, name) {
  const match = html.match(new RegExp(`(?:async )?function ${name}\\([^]*?\\n\\}`));
  if (!match) throw new Error(`Missing page function: ${name}`);
  return match[0];
}

export async function horizonRuntime(overrides = {}) {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const section = (start, end) => {
    const from = html.indexOf(start), to = html.indexOf(end, from);
    if (from < 0 || to < 0) throw new Error(`Missing horizon section: ${start}`);
    return html.slice(from, to);
  };
  // Reuse the browser's actual sampling and solar algorithms, not a second model.
  const source = [
    'const D2R = Math.PI / 180;',
    pageFunction(html, 'solarParams'),
    section('const R_EARTH ', 'let hzProfile '),
    section('const SOL_EYE_HEIGHT ', 'const SOL_QUIZ '),
    ...['hzMetersBetween', 'solCalendarDay', 'solDayStart', 'solCalibrateProfile',
      'solApplyCalibration', 'solValidateHorizonData'].map(name => pageFunction(html, name)),
    '({ buildHorizonProfile, solValidateHorizonData, computeSunWindows, solarPosition, horizonAt,',
    'solDayStart, solCalibrateProfile, point: HZ_HOME_DEFAULT, eye: SOL_EYE_HEIGHT })',
  ].join('\n');
  return runInNewContext(source, { fetch, Date, Intl, console, setTimeout, ...overrides });
}

async function update() {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--from-profile')) {
    throw new Error('Usage: node scripts\\update-solhjornet-horizon.mjs [--from-profile SAVED_PROFILE.json]');
  }
  const runtime = await horizonRuntime({
    fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(15000) }),
  });
  const mask = JSON.parse(await readFile(new URL('../solhjornet-buildings.json', import.meta.url), 'utf8'));
  let lastPercent = -1;
  const profile = args.length ? JSON.parse(await readFile(resolve(args[1]), 'utf8'))
    : await runtime.buildHorizonProfile(runtime.point.lat, runtime.point.lng, runtime.eye, (done, total) => {
      const percent = Math.floor(done / total * 100);
      if (percent !== lastPercent && percent % 10 === 0) {
        console.log(`Sampling horizon: ${percent}%`);
        lastPercent = percent;
      }
    }, mask);
  const data = {
    version: 1, sourceDate: mask.sourceDate,
    elevationSource: 'https://ws.geonorge.no/hoydedata/v1/',
    elevationLicense: 'CC-BY-4.0', profile,
  };
  runtime.solValidateHorizonData(data, mask);
  const calibration = runtime.solCalibrateProfile(profile);
  const target = fileURLToPath(new URL('../solhjornet-horizon.json', import.meta.url));
  await writeFile(target + '.tmp', JSON.stringify(data) + '\n');
  await rename(target + '.tmp', target);
  console.log(JSON.stringify({ rays: profile.rays.length, ground: profile.ground,
    builtAt: new Date(profile.builtAt).toISOString(), variant: profile.variant, calibration }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await update();
