import { writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseSurroundings } from '../surroundings-data.mjs';

const args = process.argv.slice(2);
const [lat, lng] = args.map(Number);
if (args.length !== 2 || !Number.isFinite(lat) || !Number.isFinite(lng)
    || lat < 57 || lat > 72 || lng < 3 || lng > 32) {
  throw new Error('Usage: node scripts\\update-solhjornet-buildings.mjs LATITUDE LONGITUDE (Norway)');
}
const radius = 650;
const endpoint = 'https://overpass-api.de/api/interpreter';
const query = `[out:json][timeout:45][maxsize:16777216];
  wr(around:${radius},${lat},${lng})["building"]["building"!="no"]->.features;
  (.features;rel(bw.features)["type"="multipolygon"];);out body geom;`;
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 60000);
try {
  const response = await fetch(endpoint, {
    method: 'POST', body: new URLSearchParams({ data: query }), signal: controller.signal,
    headers: { 'User-Agent': 'solmelding-building-mask/1.0 (+https://github.com/odallokken/solmelding)' },
  });
  if (!response.ok) throw new Error(`Overpass HTTP ${response.status}; no data written.`);
  const osm = await response.json();
  const mapping = parseSurroundings(osm, { lat, lng }, { radius, maxBuildings: Infinity, minArea: .001 });
  if (!mapping.buildings.length || mapping.incomplete) {
    throw new Error(`Incomplete building mask: ${mapping.buildings.length} shapes, ${mapping.incomplete} incomplete; no data written.`);
  }
  const rounded = ring => ring.map(p => ({ x: +p.x.toFixed(3), z: +p.z.toFixed(3) }));
  const buildings = mapping.buildings.map(building => {
    const outer = rounded(building.outer), holes = building.holes.map(rounded);
    return {
      id: building.id, outer, holes,
      bounds: [Math.min(...outer.map(p => p.x)), Math.min(...outer.map(p => p.z)),
        Math.max(...outer.map(p => p.x)), Math.max(...outer.map(p => p.z))],
    };
  }).sort((a, b) => a.id.localeCompare(b.id));
  const mask = {
    lat, lng, radius, version: createHash('sha256').update(JSON.stringify({ lat, lng, radius, buildings })).digest('hex').slice(0, 16),
    source: endpoint, sourceDate: osm.osm3s?.timestamp_osm_base, fetchedAt: new Date().toISOString(),
    copyright: 'OpenStreetMap contributors', license: 'ODbL-1.0',
    licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/', attributionUrl: 'https://www.openstreetmap.org/copyright',
    query, buildings,
  };
  if (!mask.sourceDate) throw new Error('Source database date missing; no data written.');
  const target = fileURLToPath(new URL('../solhjornet-buildings.json', import.meta.url));
  await writeFile(target + '.tmp', JSON.stringify(mask) + '\n');
  await rename(target + '.tmp', target);
  console.log(JSON.stringify({ buildings: buildings.length, version: mask.version, sourceDate: mask.sourceDate }));
} finally {
  clearTimeout(timeout);
}
