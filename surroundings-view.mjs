import * as THREE from './vendor/three/three.module.min.js';

const DEG = Math.PI / 180;
const SKY_DISTANCE = 3000;
const MIN_PITCH = -45;
const MAX_PITCH = 80;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const heading = value => ((value % 360) + 360) % 360;
const finite = values => values.every(Number.isFinite);

function direction(azimuth, elevation, distance = 1) {
  const horizontal = Math.cos(elevation * DEG) * distance;
  return new THREE.Vector3(
    Math.sin(azimuth * DEG) * horizontal,
    Math.sin(elevation * DEG) * distance,
    -Math.cos(azimuth * DEG) * horizontal,
  );
}

function validate(model, context) {
  if (!context || !finite([context.lat, context.lng, context.eye, context.ground,
    context.startMs, context.endMs, context.sunRadius])
      || context.endMs <= context.startMs || context.sunRadius <= 0
      || Math.abs(context.lat) > 90 || Math.abs(context.lng) > 180
      || typeof context.solarPosition !== 'function' || typeof context.horizonAt !== 'function'
      || context.profile?.rays?.length !== 360
      || !context.profile.rays.every(ray => ray && Number.isFinite(ray.alt))) {
    throw new Error('3D-visningen mangler gyldig posisjon, tidsrom eller målt horisont.');
  }
  const terrain = model?.terrain;
  if (!(terrain?.positions instanceof Float32Array) || !(terrain.indices instanceof Uint32Array)
      || terrain.positions.length % 3 || terrain.indices.length % 3
      || !terrain.positions.every(Number.isFinite)
      || !terrain.indices.every(index => index < terrain.positions.length / 3)
      || !Array.isArray(model.buildings) || !Array.isArray(model.trees)) {
    throw new Error('Terrengdataene for 3D-visningen er ugyldige.');
  }
  const validRing = ring => Array.isArray(ring) && ring.length >= 3
    && ring.every(point => point && finite([point.x, point.z]));
  for (const building of model.buildings) {
    if (!building || !validRing(building.outer) || !Array.isArray(building.holes)
        || !building.holes.every(validRing) || !finite([building.base, building.height])
        || building.height <= 0) {
      throw new Error('En bygning mangler gyldig omriss eller høyde.');
    }
  }
  for (const tree of model.trees) {
    if (!tree || !finite([tree.x, tree.z, tree.ground, tree.height, tree.radius])
        || tree.height <= 0 || tree.radius <= 0) {
      throw new Error('Et tre mangler gyldig plassering eller høyde.');
    }
  }
}

function solarAt(context, timeMs) {
  const position = context.solarPosition(timeMs, context.lat, context.lng);
  if (!position || !finite([position.azimuth, position.refracted])
      || Math.abs(position.refracted) > 90) {
    throw new Error('Solberegningen ga en ugyldig posisjon.');
  }
  return { azimuth: heading(position.azimuth), elevation: position.refracted };
}

function obstructionAt(context, azimuth) {
  const obstruction = context.horizonAt(context.profile, azimuth);
  if (!Number.isFinite(obstruction) || Math.abs(obstruction) > 90) {
    throw new Error('Den målte horisonten inneholder en ugyldig vinkel.');
  }
  return obstruction;
}

function buildingGeometry(buildings) {
  const parts = [[], []];
  const counts = [0, 0];
  for (const building of buildings) {
    // Negating the shape's second axis, then rotating the extrusion, keeps +Z south.
    const points = (ring, clockwise) => {
      const result = ring.map(point => new THREE.Vector2(point.x, -point.z));
      if (THREE.ShapeUtils.isClockWise(result) !== clockwise) result.reverse();
      return result;
    };
    const shape = new THREE.Shape(points(building.outer, true));
    shape.holes = building.holes.map(ring => new THREE.Path(points(ring, false)));
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: building.height, steps: 1, bevelEnabled: false, curveSegments: 1,
    });
    try {
      geometry.rotateX(-Math.PI / 2);
      geometry.translate(0, building.base, 0);
      const positions = geometry.getAttribute('position').array;
      const normals = geometry.getAttribute('normal').array;
      for (const group of geometry.groups) {
        const start = group.start * 3, end = (group.start + group.count) * 3;
        parts[group.materialIndex].push({
          positions: positions.slice(start, end), normals: normals.slice(start, end),
        });
        counts[group.materialIndex] += group.count;
      }
    } finally {
      geometry.dispose();
    }
  }
  const positions = new Float32Array((counts[0] + counts[1]) * 3);
  const normals = new Float32Array(positions.length);
  let offset = 0;
  for (const group of parts) {
    for (const part of group) {
      positions.set(part.positions, offset);
      normals.set(part.normals, offset);
      offset += part.positions.length;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.addGroup(0, counts[0], 0);
  geometry.addGroup(counts[0], counts[1], 1);
  geometry.computeBoundingSphere();
  return geometry;
}

function solarPath(context) {
  const vertices = [];
  const step = Math.max(10 * 60000, (context.endMs - context.startMs) / 288);
  let previousTime = context.startMs;
  let previous = solarAt(context, previousTime);
  while (previousTime < context.endMs) {
    const time = Math.min(previousTime + step, context.endMs);
    const next = solarAt(context, time);
    const previousUp = previous.elevation + context.sunRadius > 0;
    const nextUp = next.elevation + context.sunRadius > 0;
    if (previousUp || nextUp) {
      let from = previous, to = next;
      if (previousUp !== nextUp) {
        let low = previousTime, high = time;
        for (let iteration = 0; iteration < 16; iteration++) {
          const middle = (low + high) / 2;
          const up = solarAt(context, middle).elevation + context.sunRadius > 0;
          if (up === previousUp) low = middle;
          else high = middle;
        }
        const crossing = solarAt(context, (low + high) / 2);
        if (previousUp) to = crossing;
        else from = crossing;
      }
      // Independent segments never join sunset to the following sunrise.
      vertices.push(...direction(from.azimuth, from.elevation, SKY_DISTANCE).toArray(),
        ...direction(to.azimuth, to.elevation, SKY_DISTANCE).toArray());
    }
    previousTime = time;
    previous = next;
  }
  return new THREE.BufferGeometry()
    .setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
}

function disposeBundle(bundle) {
  if (!bundle) return;
  for (const mesh of bundle.instances) mesh.dispose();
  for (const geometry of bundle.geometries) geometry.dispose();
  bundle.root.removeFromParent();
  bundle.root.clear();
}

export function createSurroundingsView({ canvas, onDirection, onSunState, onError }) {
  if (!canvas || typeof canvas.getContext !== 'function') {
    throw new Error('3D-visningen mangler et lerret.');
  }
  let renderer;
  let gl;
  try {
    gl = canvas.getContext('webgl2', {
      alpha: false, antialias: true, depth: true, stencil: false, powerPreference: 'low-power',
    });
    if (!gl || gl.isContextLost()) throw new Error('WebGL2 er ikke tilgjengelig.');
    renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true });
  } catch (cause) {
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    throw new Error('Nettleseren kunne ikke starte 3D-visningen med WebGL2.', { cause });
  }
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.debug.onShaderError = () => {
    throw new Error('Grafikkortet kunne ikke tegne 3D-visningen.');
  };

  const scene = new THREE.Scene();
  const night = new THREE.Color('#102136');
  const twilight = new THREE.Color('#687a96');
  const daylight = new THREE.Color('#bddce9');
  scene.background = daylight.clone();
  scene.fog = new THREE.Fog(scene.background, 230, 650);
  const camera = new THREE.PerspectiveCamera(68, 1, 0.08, SKY_DISTANCE * 2);
  const ambient = new THREE.HemisphereLight('#e3f3ff', '#526b59', 2);
  const sunlight = new THREE.DirectionalLight('#fff0cb', 2);
  // Lighting is illustrative; only the measured profile decides solar visibility.
  renderer.shadowMap.enabled = false;
  scene.add(ambient, sunlight, sunlight.target);

  const overlay = { transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false };
  const materials = {
    terrain: new THREE.MeshStandardMaterial({ color: '#709a82', roughness: 1, flatShading: true }),
    roof: new THREE.MeshStandardMaterial({ color: '#859daf', roughness: 0.95 }),
    wall: new THREE.MeshStandardMaterial({ color: '#d1dfde', roughness: 1 }),
    edges: new THREE.LineBasicMaterial({ color: '#27465c', transparent: true, opacity: 0.42 }),
    trunk: new THREE.MeshStandardMaterial({ color: '#716252', roughness: 1, flatShading: true }),
    crown: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true }),
    horizon: new THREE.LineDashedMaterial({
      ...overlay, color: '#527c8e', opacity: 0.62, dashSize: 20, gapSize: 12,
    }),
    path: new THREE.LineBasicMaterial({ ...overlay, color: '#e9a950', opacity: 0.6 }),
    sun: new THREE.MeshBasicMaterial({ ...overlay, color: '#fff4b9' }),
    halo: new THREE.MeshBasicMaterial({ ...overlay, color: '#f4a429', opacity: 0.13 }),
    ring: new THREE.MeshBasicMaterial({ ...overlay, color: '#f4a429', opacity: 0.85 }),
  };
  const listeners = [];
  const previousTouchAction = canvas.style.touchAction;
  canvas.style.touchAction = 'none';
  let bundle = null, context = null, sunState = null;
  let disposed = false, contextLost = false, oriented = false;
  let yaw = 0, pitch = 8, width = 0, height = 0;
  let activePointer = null;
  const pointers = new Set();

  function report(error) {
    const failure = error instanceof Error ? error : new Error(String(error));
    if (typeof onError === 'function') onError(failure);
    else throw failure;
  }

  function assertActive() {
    if (disposed) throw new Error('3D-visningen er lukket.');
    if (contextLost) throw new Error('Forbindelsen til grafikkortet er brutt. Åpne 3D-visningen på nytt.');
  }

  function run(action, rethrow = true) {
    try {
      assertActive();
      return action();
    } catch (error) {
      report(error);
      if (rethrow) throw error;
    }
  }

  function updateCamera() {
    camera.lookAt(camera.position.clone().add(direction(yaw, pitch)));
    camera.updateMatrixWorld();
  }

  function render() {
    if (disposed || contextLost || width <= 0 || height <= 0) return;
    if (gl.isContextLost()) {
      throw new Error('Forbindelsen til grafikkortet er brutt. Åpne 3D-visningen på nytt.');
    }
    updateCamera();
    if (bundle) bundle.marker.quaternion.copy(camera.quaternion);
    renderer.render(scene, camera);
  }

  function changeDirection(azimuth, elevation) {
    yaw = heading(azimuth);
    pitch = clamp(elevation, MIN_PITCH, MAX_PITCH);
    oriented = true;
    updateCamera();
    if (typeof onDirection === 'function') onDirection({ azimuth: yaw, pitch });
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(0, Math.round(bounds.width));
    height = Math.max(0, Math.round(bounds.height));
    if (!width || !height) return;
    const pixelRatio = Math.min(globalThis.devicePixelRatio || 1, 1.5);
    if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio);
    const size = renderer.getSize(new THREE.Vector2());
    if (size.x !== width || size.y !== height) renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  }

  function build(model, nextContext) {
    const next = { root: new THREE.Group(), geometries: new Set(), instances: [], marker: null };
    const own = geometry => { next.geometries.add(geometry); return geometry; };
    try {
      if (model.terrain.indices.length) {
        const geometry = own(new THREE.BufferGeometry());
        geometry.setAttribute('position', new THREE.BufferAttribute(model.terrain.positions, 3));
        geometry.setIndex(new THREE.BufferAttribute(model.terrain.indices, 1));
        geometry.computeVertexNormals();
        next.root.add(new THREE.Mesh(geometry, materials.terrain));
      }
      if (model.buildings.length) {
        const geometry = own(buildingGeometry(model.buildings));
        next.root.add(new THREE.Mesh(geometry, [materials.roof, materials.wall]));
        next.root.add(new THREE.LineSegments(own(new THREE.EdgesGeometry(geometry, 25)), materials.edges));
      }
      if (model.trees.length) {
        const trunks = new THREE.InstancedMesh(
          own(new THREE.CylinderGeometry(0.7, 1, 1, 5)), materials.trunk, model.trees.length,
        );
        next.instances.push(trunks);
        const crowns = new THREE.InstancedMesh(
          own(new THREE.IcosahedronGeometry(1, 0)), materials.crown, model.trees.length,
        );
        next.instances.push(crowns);
        const transform = new THREE.Object3D();
        const mappedTreeColor = new THREE.Color('#568c70');
        const woodColor = new THREE.Color('#477864');
        model.trees.forEach((tree, index) => {
          const trunkRadius = clamp(tree.radius * 0.12, 0.08, 0.6);
          const crownHeight = Math.min(tree.height * 0.78, tree.radius * 2.2);
          const trunkHeight = tree.height - crownHeight / 2;
          transform.position.set(tree.x, tree.ground + trunkHeight / 2, tree.z);
          transform.scale.set(trunkRadius, trunkHeight, trunkRadius);
          transform.updateMatrix();
          trunks.setMatrixAt(index, transform.matrix);
          transform.position.y = tree.ground + tree.height - crownHeight / 2;
          transform.scale.set(tree.radius, crownHeight / 2, tree.radius);
          transform.updateMatrix();
          crowns.setMatrixAt(index, transform.matrix);
          crowns.setColorAt(index, tree.source === 'mapped-tree' ? mappedTreeColor : woodColor);
        });
        trunks.instanceMatrix.needsUpdate = true;
        crowns.instanceMatrix.needsUpdate = true;
        crowns.instanceColor.needsUpdate = true;
        trunks.computeBoundingSphere();
        crowns.computeBoundingSphere();
        next.root.add(trunks, crowns);
      }
      const sky = new THREE.Group();
      sky.position.set(0, nextContext.eye, 0);
      next.root.add(sky);
      const horizonPoints = [];
      for (let azimuth = 0; azimuth <= 360; azimuth++) {
        horizonPoints.push(direction(azimuth, obstructionAt(nextContext, heading(azimuth)), SKY_DISTANCE));
      }
      const horizon = new THREE.Line(
        own(new THREE.BufferGeometry().setFromPoints(horizonPoints)), materials.horizon,
      );
      horizon.computeLineDistances();
      horizon.renderOrder = 10;
      sky.add(horizon);
      const pathGeometry = own(solarPath(nextContext));
      if (pathGeometry.getAttribute('position').count) {
        const path = new THREE.LineSegments(pathGeometry, materials.path);
        path.renderOrder = 11;
        sky.add(path);
      }
      const marker = new THREE.Group();
      marker.visible = false;
      const radius = SKY_DISTANCE * Math.tan(nextContext.sunRadius * DEG);
      const locatorRadius = SKY_DISTANCE * Math.tan(Math.max(1.8, nextContext.sunRadius * 5) * DEG);
      const halo = new THREE.Mesh(own(new THREE.CircleGeometry(locatorRadius, 32)), materials.halo);
      const ring = new THREE.Mesh(
        own(new THREE.RingGeometry(locatorRadius * 0.82, locatorRadius * 0.9, 32)), materials.ring,
      );
      // The locator is enlarged for small screens; visibility still uses the physical solar radius.
      const disc = new THREE.Mesh(own(new THREE.CircleGeometry(Math.max(radius, locatorRadius * .35), 32)), materials.sun);
      halo.renderOrder = 20;
      ring.renderOrder = 21;
      disc.renderOrder = 22;
      marker.add(halo, ring, disc);
      sky.add(marker);
      next.marker = marker;
      return next;
    } catch (error) {
      disposeBundle(next);
      throw error;
    }
  }

  function setModel(model, nextContext) {
    validate(model, nextContext);
    const next = build(model, nextContext);
    disposeBundle(bundle);
    bundle = next;
    context = nextContext;
    sunState = null;
    scene.add(bundle.root);
    camera.position.set(0, context.eye, 0);
    sunlight.target.position.copy(camera.position);
    updateCamera();
    if (typeof onDirection === 'function') onDirection({ azimuth: yaw, pitch });
    resize();
  }

  function setTime(timeMs) {
    if (!context || !bundle) throw new Error('Last inn omgivelser før du velger soltid.');
    if (!Number.isFinite(timeMs)) throw new Error('Velg et gyldig tidspunkt for sola.');
    const position = solarAt(context, timeMs);
    const obstruction = obstructionAt(context, position.azimuth);
    const upperLimb = position.elevation + context.sunRadius;
    sunState = {
      ...position, obstruction, visible: upperLimb > obstruction, belowHorizon: upperLimb <= 0, timeMs,
    };
    bundle.marker.position.copy(direction(position.azimuth, position.elevation, SKY_DISTANCE));
    bundle.marker.visible = true;
    materials.sun.color.set(sunState.visible ? '#ffc857' : '#aebcca');
    materials.sun.opacity = sunState.visible ? 1 : 0.65;
    materials.ring.color.set(sunState.visible ? '#f4a429' : '#92a7ba');
    materials.ring.opacity = sunState.visible ? 0.85 : 0.5;
    materials.halo.opacity = sunState.visible ? 0.13 : 0.04;
    const twilightAmount = clamp((position.elevation + 12) / 12, 0, 1);
    const daylightAmount = clamp(position.elevation / 20, 0, 1);
    scene.background.copy(night).lerp(twilight, twilightAmount).lerp(daylight, daylightAmount);
    scene.fog.color.copy(scene.background);
    ambient.intensity = 0.3 + 1.9 * twilightAmount;
    sunlight.intensity = Math.max(0, Math.sin(position.elevation * DEG)) * 2.3;
    sunlight.position.copy(camera.position).add(direction(position.azimuth, position.elevation, 100));
    materials.horizon.color.set(position.elevation < 0 ? '#89b8c5' : '#527c8e');
    if (!oriented) changeDirection(position.azimuth, 8);
    if (typeof onSunState === 'function') onSunState({ ...sunState });
    render();
  }

  function lookAtSun() {
    if (!sunState) throw new Error('Velg et tidspunkt før du ser mot sola.');
    changeDirection(sunState.azimuth, sunState.elevation);
    render();
  }

  function lookNorth() {
    changeDirection(0, 8);
    render();
  }

  function zoom(delta) {
    camera.fov = clamp(camera.fov + delta, 35, 90);
    camera.updateProjectionMatrix();
    render();
  }

  function listen(target, name, handler, options) {
    const guarded = event => {
      if (!disposed) run(() => handler(event), false);
    };
    target.addEventListener(name, guarded, options);
    listeners.push(() => target.removeEventListener(name, guarded, options));
  }

  function releasePointer(pointerId) {
    if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
  }

  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (activePointer?.id === event.pointerId) activePointer = null;
    releasePointer(event.pointerId);
  }

  listen(canvas, 'pointerdown', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey) return;
    pointers.add(event.pointerId);
    canvas.setPointerCapture(event.pointerId);
    if (pointers.size !== 1 || !event.isPrimary) {
      activePointer = null;
      return;
    }
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    activePointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  listen(canvas, 'pointermove', event => {
    if (!activePointer || activePointer.id !== event.pointerId || pointers.size !== 1) return;
    if (event.pointerType === 'mouse' && !(event.buttons & 1)) {
      endPointer(event);
      return;
    }
    event.preventDefault();
    const dx = event.clientX - activePointer.x, dy = event.clientY - activePointer.y;
    activePointer.x = event.clientX;
    activePointer.y = event.clientY;
    const degreesPerPixel = camera.fov / Math.max(200, height);
    changeDirection(yaw - dx * degreesPerPixel, pitch + dy * degreesPerPixel);
    render();
  });
  listen(canvas, 'pointerup', endPointer);
  listen(canvas, 'pointercancel', endPointer);
  listen(canvas, 'lostpointercapture', event => {
    pointers.delete(event.pointerId);
    if (activePointer?.id === event.pointerId) activePointer = null;
  });
  listen(canvas, 'blur', () => {
    activePointer = null;
    for (const pointerId of pointers) releasePointer(pointerId);
    pointers.clear();
  });
  listen(canvas, 'keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const step = event.shiftKey ? 12 : 4;
    const actions = {
      ArrowLeft: () => { changeDirection(yaw - step, pitch); render(); },
      ArrowRight: () => { changeDirection(yaw + step, pitch); render(); },
      ArrowUp: () => { changeDirection(yaw, pitch + step); render(); },
      ArrowDown: () => { changeDirection(yaw, pitch - step); render(); },
      Home: lookNorth,
      '+': () => zoom(-5),
      '=': () => zoom(-5),
      '-': () => zoom(5),
      '_': () => zoom(5),
    };
    if (!Object.hasOwn(actions, event.key)) return;
    event.preventDefault();
    actions[event.key]();
  });

  const handleContextLost = event => {
    if (disposed) return;
    event.preventDefault();
    contextLost = true;
    activePointer = null;
    pointers.clear();
    report(new Error('Forbindelsen til grafikkortet er brutt. Åpne 3D-visningen på nytt.'));
  };
  const handleContextRestored = () => {
    if (disposed) return;
    contextLost = false;
    run(resize, false);
  };
  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);
  listeners.push(() => canvas.removeEventListener('webglcontextlost', handleContextLost));
  listeners.push(() => canvas.removeEventListener('webglcontextrestored', handleContextRestored));

  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
    if (!disposed && !contextLost) run(resize, false);
  }) : null;
  observer?.observe(canvas);
  if (typeof window !== 'undefined') listen(window, 'resize', resize);

  function dispose() {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    for (const remove of listeners) remove();
    activePointer = null;
    for (const pointerId of pointers) releasePointer(pointerId);
    pointers.clear();
    canvas.style.touchAction = previousTouchAction;
    disposeBundle(bundle);
    bundle = null;
    context = null;
    sunState = null;
    for (const material of Object.values(materials)) material.dispose();
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  try {
    resize();
  } catch (error) {
    dispose();
    throw error;
  }
  return {
    setModel: (model, nextContext) => run(() => setModel(model, nextContext)),
    setTime: timeMs => run(() => setTime(timeMs)),
    lookAtSun: () => run(lookAtSun),
    lookNorth: () => run(lookNorth),
    resize: () => run(resize),
    dispose,
  };
}
