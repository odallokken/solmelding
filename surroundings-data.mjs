import { ShapeUtils, Vector2 } from './vendor/three/three.module.min.js';

const RADIUS = 150;
const GRID_STEPS = 17;
const MAX_BUILDINGS = 160;
const MAX_TREES = 160;
const METRES_PER_DEGREE = Math.PI * 6371000 / 180;
const OVERPASS_URL = 'https://overpass.private.coffee/api/interpreter';
const CACHE_KEY = 'solmelding_surroundings_osm_v1';
const CACHE_AGE = 7 * 86400000;
let retryMappingAfter = 0;

export async function loadSurroundings(origin, options) {
  const { signal, onProgress = () => {} } = options;
  const key = [origin.lat, origin.lng, RADIUS].join(':');
  let entries = [], cacheAvailable = true;
  try {
    const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
    if (Array.isArray(stored)) entries = stored.filter(entry => entry && typeof entry.at === 'number' && entry.osm);
  } catch (error) {
    console.warn('Kunne ikke lese lagret 3D-kartgrunnlag:', error);
    cacheAvailable = false;
  }
  const now = Date.now();
  const cached = entries.find(entry => entry.key === key && now - entry.at >= 0 && now - entry.at < CACHE_AGE);
  let osm;
  if (cached) {
    osm = cached.osm;
    onProgress('Bruker lagrede bygningsformer og kartlagte tr\u00e6r \u2026');
  } else {
    if (now < retryMappingAfter) throw new Error('Karttjenesten er opptatt. Vent et minutt f\u00f8r du pr\u00f8ver igjen.');
    onProgress('Henter bygningsformer og kartlagte tr\u00e6r fra OpenStreetMap \u2026');
    const query = `[out:json][timeout:25][maxsize:16777216];
      (wr(around:${RADIUS},${origin.lat},${origin.lng})["building"]["building"!="no"];
      node(around:${RADIUS},${origin.lat},${origin.lng})["natural"="tree"];
      wr(around:${RADIUS},${origin.lat},${origin.lng})["natural"="wood"];
      wr(around:${RADIUS},${origin.lat},${origin.lng})["landuse"="forest"];)->.features;
      (.features;rel(bw.features)["type"="multipolygon"];);out body geom;`;
    const response = await fetch(OVERPASS_URL, {
      method: 'POST', body: new URLSearchParams({ data: query }), credentials: 'omit', signal,
    });
    if (!response.ok) {
      retryMappingAfter = Date.now() + 60000;
      throw new Error(`Karttjenesten svarte HTTP ${response.status}. Pr\u00f8v igjen senere.`);
    }
    const body = await response.text();
    if (body.length > 5 * 1024 * 1024) throw new Error('Kartgrunnlaget er for stort for denne 3D-visningen.');
    osm = JSON.parse(body);
    parseSurroundings(osm, origin);
    checkAbort(signal);
    const entry = { key, at: now, osm, endpoint: OVERPASS_URL, query };
    if (cacheAvailable) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify([...entries.filter(item => item.key !== key), entry].slice(-3)));
      } catch (error) {
        console.warn('Kunne ikke lagre 3D-kartgrunnlaget:', error);
        cacheAvailable = false;
      }
    }
  }
  const model = await buildSurroundingsModel(osm, origin, options);
  const base = osm.osm3s && osm.osm3s.timestamp_osm_base;
  const age = base ? (now - Date.parse(base)) / 86400000 : NaN;
  model.provenance = { endpoint: OVERPASS_URL, osmBase: base || null, fetchedAt: cached ? cached.at : now };
  model.description += base ? ` OSM-grunnlag: ${base.slice(0, 10)}.` : ' Karttjenesten oppga ikke dato for OSM-grunnlaget.';
  if (age > 90) model.description += ' Merk: kartgrunnlaget er mer enn 90 dager gammelt; nyere endringer kan mangle.';
  if (!cacheAvailable) model.description += ' Nettleseren kunne ikke mellomlagre kartgrunnlaget til senere bes\u00f8k.';
  return model;
}

export function toLocal(lat, lng, origin) {
  const delta = ((lng - origin.lng + 540) % 360) - 180;
  return {
    x: delta * METRES_PER_DEGREE * Math.cos(origin.lat * Math.PI / 180),
    z: (origin.lat - lat) * METRES_PER_DEGREE,
  };
}

function toLatLng(point, origin) {
  return [
    origin.lat - point.z / METRES_PER_DEGREE,
    origin.lng + point.x / (METRES_PER_DEGREE * Math.cos(origin.lat * Math.PI / 180)),
  ];
}

const samePoint = (a, b) => Math.hypot(a.x - b.x, a.z - b.z) < .02;
const area = ring => ring.reduce((sum, p, i) => {
  const q = ring[(i + 1) % ring.length];
  return sum + p.x * q.z - q.x * p.z;
}, 0) / 2;

export function inRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a.z > point.z) !== (b.z > point.z)
        && point.x < (b.x - a.x) * (point.z - a.z) / (b.z - a.z) + a.x) inside = !inside;
  }
  return inside;
}

const inPolygon = (point, polygon) => inRing(point, polygon.outer)
  && !polygon.holes.some(hole => inRing(point, hole));

function localGeometry(geometry, origin) {
  if (!Array.isArray(geometry) || geometry.length > 20000 || geometry.some(p => !p || !Number.isFinite(p.lat)
      || !Number.isFinite(p.lon) || Math.abs(p.lat) > 90 || Math.abs(p.lon) > 180)) return [];
  return geometry.map(p => toLocal(p.lat, p.lon, origin))
    .filter((p, i, points) => i === 0 || !samePoint(p, points[i - 1]));
}

function stitchRings(segments) {
  const remaining = segments.filter(segment => segment.length >= 2).map(segment => segment.slice());
  const rings = [];
  let incomplete = segments.filter(segment => segment.length < 2).length;
  while (remaining.length) {
    const ring = remaining.shift();
    while (!samePoint(ring[0], ring[ring.length - 1])) {
      const index = remaining.findIndex(segment =>
        samePoint(segment[0], ring[ring.length - 1])
        || samePoint(segment[segment.length - 1], ring[ring.length - 1]));
      if (index === -1) break;
      const segment = remaining.splice(index, 1)[0];
      if (!samePoint(segment[0], ring[ring.length - 1])) segment.reverse();
      ring.push(...segment.slice(1));
    }
    if (ring.length >= 4 && samePoint(ring[0], ring[ring.length - 1])) {
      ring.pop();
      if (Math.abs(area(ring)) > 1) rings.push(ring);
      else incomplete++;
    } else incomplete++;
  }
  return { rings, incomplete };
}

function nearby(polygon) {
  const xs = polygon.outer.map(p => p.x), zs = polygon.outer.map(p => p.z);
  return Math.min(...xs) <= RADIUS && Math.max(...xs) >= -RADIUS
    && Math.min(...zs) <= RADIUS && Math.max(...zs) >= -RADIUS;
}

function polygonsFor(element, origin) {
  if (element.type === 'way') {
    const geometry = localGeometry(element.geometry, origin);
    if (geometry.length < 4) return { polygons: [], incomplete: 1 };
    const { rings, incomplete } = stitchRings([geometry]);
    return { polygons: rings.map(outer => ({ outer, holes: [] })), incomplete };
  }
  const members = element.members || [];
  const outer = stitchRings(members.filter(m => m.type === 'way' && (m.role === 'outer' || !m.role))
    .map(m => localGeometry(m.geometry, origin)));
  const inner = stitchRings(members.filter(m => m.type === 'way' && m.role === 'inner')
    .map(m => localGeometry(m.geometry, origin)));
  const polygons = outer.rings.map(ring => ({ outer: ring, holes: [] }));
  let incomplete = outer.incomplete + inner.incomplete + members.filter(m => m.type === 'relation').length;
  for (const hole of inner.rings) {
    const owner = polygons.filter(p => inRing(hole[0], p.outer))
      .sort((a, b) => Math.abs(area(a.outer)) - Math.abs(area(b.outer)))[0];
    if (owner) owner.holes.push(hole);
    else incomplete++;
  }
  return { polygons, incomplete };
}

export function parseSurroundings(osm, origin) {
  if (!osm || !Array.isArray(osm.elements) || osm.remark) {
    throw new Error('Karttjenesten leverte et ufullstendig svar. Pr\u00f8v igjen senere.');
  }
  const buildings = [], woods = [], trees = [], representedWays = new Set();
  const ways = new Map(osm.elements.filter(element => element.type === 'way').map(element => [element.id, element]));
  let incomplete = 0;
  const elements = [...osm.elements].sort((a, b) => (a.type === 'relation' ? -1 : 0) - (b.type === 'relation' ? -1 : 0));
  for (const element of elements) {
    let tags = element.tags || {};
    if (element.type === 'relation' && tags.type === 'multipolygon'
        && !tags.building && tags.natural !== 'wood' && tags.landuse !== 'forest') {
      const outer = (element.members || []).filter(member => member.type === 'way' && (member.role === 'outer' || !member.role))
        .map(member => ways.get(member.ref)).find(way => way && way.tags
          && (way.tags.building || way.tags.natural === 'wood' || way.tags.landuse === 'forest'));
      if (outer) tags = { ...outer.tags, ...tags };
    }
    if (element.type === 'node' && tags.natural === 'tree'
        && Number.isFinite(element.lat) && Number.isFinite(element.lon)) {
      const point = toLocal(element.lat, element.lon, origin);
      if (Math.hypot(point.x, point.z) <= RADIUS) trees.push({ ...point, tags, source: 'mapped-tree' });
      continue;
    }
    const building = tags.building && tags.building !== 'no';
    const wooded = tags.natural === 'wood' || tags.landuse === 'forest';
    if ((!building && !wooded) || (element.type !== 'way' && element.type !== 'relation')) continue;
    if (element.type === 'way' && representedWays.has(element.id)) continue;
    const parsed = polygonsFor(element, origin);
    incomplete += parsed.incomplete;
    if (element.type === 'relation') {
      for (const member of element.members || []) {
        const way = ways.get(member.ref);
        const independent = member.role === 'inner' && way && way.tags
          && (way.tags.building || way.tags.natural === 'wood' || way.tags.landuse === 'forest');
        if (member.type === 'way' && !independent) representedWays.add(member.ref);
      }
    }
    // An incomplete courtyard must not become a solid building.
    if (parsed.incomplete) continue;
    const local = parsed.polygons.filter(nearby);
    local.forEach((polygon, i) => {
      const feature = { ...polygon, id: `${element.type}/${element.id}/${i}`, tags };
      if (building) buildings.push(feature);
      else woods.push(feature);
    });
  }
  buildings.sort((a, b) => distanceToPolygon(a) - distanceToPolygon(b));
  return {
    buildings: buildings.slice(0, MAX_BUILDINGS), woods, trees,
    incomplete: incomplete + Math.max(0, buildings.length - MAX_BUILDINGS),
  };
}

function distanceToPolygon(polygon) {
  if (inPolygon({ x: 0, z: 0 }, polygon)) return 0;
  return Math.min(...polygon.outer.map(p => Math.hypot(p.x, p.z)));
}

function roofSamples(polygon) {
  const outer = polygon.outer.map(p => new Vector2(p.x, p.z));
  const holes = polygon.holes.map(ring => ring.map(p => new Vector2(p.x, p.z)));
  const points = [polygon.outer, ...polygon.holes].flat();
  const faces = ShapeUtils.triangulateShape(outer, holes);
  return faces.map(face => {
    const triangle = face.map(i => points[i]);
    return {
      x: triangle.reduce((sum, p) => sum + p.x, 0) / 3,
      z: triangle.reduce((sum, p) => sum + p.z, 0) / 3,
      size: Math.abs(area(triangle)),
    };
  }).filter(point => point.size > .1 && inPolygon(point, polygon))
    .sort((a, b) => b.size - a.size).slice(0, 3);
}

export function heightTag(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d+(?:[.,]\d+)?)\s*(m|metres?|meters?|ft|feet|')?$/i);
  if (!match) return null;
  const result = Number(match[1].replace(',', '.')) * (/^(ft|feet|')$/i.test(match[2] || '') ? .3048 : 1);
  return result > 0 && result <= 300 ? result : null;
}

function estimatedHeight(tags) {
  const height = heightTag(tags.height);
  if (height !== null) return { height, source: 'osm' };
  if (/^\d+(?:\.\d+)?$/.test(tags['building:levels'] || '')) {
    const levels = Number(tags['building:levels']);
    if (levels > 0 && levels <= 80) return { height: levels * 3, source: 'levels' };
  }
  return null;
}

function forestCandidates(mapping) {
  const candidates = mapping.trees.filter(tree => !mapping.buildings.some(building => inPolygon(tree, building)));
  for (let z = -RADIUS + 6; z < RADIUS && candidates.length < MAX_TREES; z += 12) {
    for (let x = -RADIUS + 6; x < RADIUS && candidates.length < MAX_TREES; x += 12) {
      const point = {
        x: x + 2 * Math.sin(x * 17 + z * 31),
        z: z + 2 * Math.sin(x * 23 - z * 13),
      };
      if (Math.hypot(point.x, point.z) > RADIUS
          || !mapping.woods.some(wood => inPolygon(point, wood))
          || mapping.buildings.some(building => inPolygon(point, building))
          || candidates.some(tree => Math.hypot(tree.x - point.x, tree.z - point.z) < 6)) continue;
      candidates.push({ ...point, tags: {}, source: 'mapped-wood' });
    }
  }
  return candidates.sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z)).slice(0, MAX_TREES);
}

function checkAbort(signal) {
  if (signal && signal.aborted) throw signal.reason || new DOMException('Avbrutt', 'AbortError');
}

export async function buildSurroundingsModel(osm, origin, { fetchElevations, signal, onProgress = () => {} }) {
  if (![origin.lat, origin.lng, origin.ground].every(Number.isFinite) || Math.abs(origin.lat) > 85
      || Math.abs(origin.lng) > 180) throw new Error('Ugyldig posisjon eller bakkeniv\u00e5 for 3D-visningen.');
  const mapping = parseSurroundings(osm, origin);
  const terrainPoints = [];
  const spacing = RADIUS * 2 / (GRID_STEPS - 1);
  for (let row = 0; row < GRID_STEPS; row++) {
    for (let col = 0; col < GRID_STEPS; col++) {
      terrainPoints.push({ x: -RADIUS + col * spacing, z: -RADIUS + row * spacing });
    }
  }
  const buildings = mapping.buildings.map(building => ({ ...building, samples: roofSamples(building) }));
  const trees = forestCandidates(mapping).map(tree => ({
    ...tree,
    samples: tree.source === 'mapped-tree'
      ? [[0, 0], [-1.5, 0], [1.5, 0], [0, -1.5], [0, 1.5]].map(([dx, dz]) => ({ x: tree.x + dx, z: tree.z + dz }))
      : [{ x: tree.x, z: tree.z }],
  }));
  const surfacePoints = [];
  for (const item of [...buildings, ...trees]) {
    item.sampleOffset = surfacePoints.length;
    surfacePoints.push(...item.samples);
  }
  const groundPoints = [...terrainPoints, ...surfacePoints];
  checkAbort(signal);
  onProgress('Henter m\u00e5lt terreng og h\u00f8yder p\u00e5 bygninger og vegetasjon \u2026');
  const ground = await fetchElevations(groundPoints.map(p => toLatLng(p, origin)), 'dtm1', null, signal);
  checkAbort(signal);
  const validTerrain = ground.slice(0, terrainPoints.length).filter(Number.isFinite).length;
  if (validTerrain < terrainPoints.length * .8) {
    throw new Error('For lite terrengdata til en p\u00e5litelig 3D-visning. Velg et punkt p\u00e5 land i Norge.');
  }
  const surface = surfacePoints.length
    ? await fetchElevations(surfacePoints.map(p => toLatLng(p, origin)), 'dom1', null, signal) : [];
  checkAbort(signal);
  const localGround = terrainPoints.map((_, i) => Number.isFinite(ground[i]) ? ground[i] - origin.ground : null);
  const positions = new Float32Array(terrainPoints.flatMap((p, i) => [p.x, localGround[i] ?? 0, p.z]));
  const indices = [];
  for (let row = 0; row < GRID_STEPS - 1; row++) {
    for (let col = 0; col < GRID_STEPS - 1; col++) {
      const a = row * GRID_STEPS + col, b = a + 1, c = a + GRID_STEPS, d = c + 1;
      // Missing heights leave gaps; never invent terrain over absent data.
      if ([a, b, c, d].every(i => localGround[i] !== null)) indices.push(a, c, b, b, c, d);
    }
  }
  const results = [], treeResults = [];
  let missingBuildings = mapping.incomplete, estimatedBuildings = 0, missingTrees = 0;
  for (const building of buildings) {
    const from = building.sampleOffset, to = from + building.samples.length;
    const bases = ground.slice(terrainPoints.length + from, terrainPoints.length + to).filter(Number.isFinite);
    const roofs = surface.slice(from, to).filter(Number.isFinite);
    const estimate = estimatedHeight(building.tags);
    if (!bases.length || (!roofs.length && !estimate)) { missingBuildings++; continue; }
    const baseAbsolute = Math.min(...bases);
    const top = roofs.length ? Math.max(...roofs) : baseAbsolute + estimate.height;
    const minHeight = heightTag(building.tags.min_height) || 0;
    const height = top - baseAbsolute - minHeight;
    if (height < 1 || height > 300) { missingBuildings++; continue; }
    if (!roofs.length) estimatedBuildings++;
    results.push({
      id: building.id, outer: building.outer, holes: building.holes,
      base: baseAbsolute - origin.ground + minHeight, height,
      heightSource: roofs.length ? 'dom1' : estimate.source,
    });
  }
  for (const tree of trees) {
    const from = tree.sampleOffset, to = from + tree.samples.length;
    const bases = ground.slice(terrainPoints.length + from, terrainPoints.length + to).filter(Number.isFinite);
    const tops = surface.slice(from, to).filter(Number.isFinite);
    if (!bases.length) { missingTrees++; continue; }
    const base = bases.reduce((sum, n) => sum + n, 0) / bases.length;
    const height = tops.length ? Math.max(...tops) - base : heightTag(tree.tags.height);
    if (height === null || height < 2 || height > 60) { missingTrees++; continue; }
    treeResults.push({
      x: tree.x, z: tree.z, ground: base - origin.ground, height,
      radius: Math.max(1, Math.min(5, height * .23)), source: tree.source,
    });
  }
  const missingTerrain = terrainPoints.length - validTerrain;
  const notes = [
    `${results.length} bygningsformer og ${treeResults.length} illustrerte tr\u00e6r i n\u00e6romr\u00e5det (ca. ${RADIUS} m).`,
    'Flate tak er forenklet fra m\u00e5lte overflateh\u00f8yder; terrenget er grovere enn solberegningen.',
    'Tr\u00e6r vises bare ved kartlagte tr\u00e6r og skogarealer. Kroner og plassering innen skogarealer er omtrentlige.',
  ];
  if (estimatedBuildings) notes.push(`${estimatedBuildings} bygningsh\u00f8yder er basert p\u00e5 OSM-h\u00f8yde eller etasjeantall.`);
  if (missingBuildings || missingTrees || missingTerrain) {
    notes.push(`Ufullstendige data: ${missingBuildings} bygningsformer, ${missingTrees} tr\u00e6r og ${missingTerrain} terrengpunkter kunne ikke vises.`);
  }
  if (!results.length && !treeResults.length) notes.push('Kartgrunnlaget gir ingen visbare bygninger eller tr\u00e6r her; visningen viser bare terrenget.');
  return {
    terrain: { positions, indices: new Uint32Array(indices) },
    buildings: results, trees: treeResults, description: notes.join(' '),
    stats: { buildings: results.length, trees: treeResults.length, estimatedBuildings, missingBuildings, missingTrees, missingTerrain },
  };
}
