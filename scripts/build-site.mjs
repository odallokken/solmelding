import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of [
  'index.html', 'backgammon.js', 'backgammon.css', 'italy-days.js',
  'surroundings-data.mjs', 'surroundings-view.mjs', 'solhjornet-buildings.json', 'solhjornet-horizon.json',
  'face.png', 'arntesol.png', 'audio', 'vendor',
]) {
  await cp(new URL(name, root), new URL(name, output), { recursive: true });
}
console.log(`Static site built in ${fileURLToPath(output)}`);
