// Cảnh 3D của bản đồ vị trí (LocationMap3D). Tách file riêng để three.js chỉ tải khi khách cuộn gần tới bản đồ.
// Hướng các địa điểm giữ đúng theo toạ độ thật; khoảng cách nén theo căn bậc hai để chỗ gần (Bảo Sơn 1,6 km)
// và chỗ xa (Hoàn Kiếm 14 km) cùng vừa một khung.
import * as THREE from "three";
import { MAP_HOTEL, MAP_ROAD, type MapKind } from "@/lib/map-places";

export type ScenePlace = { key: string; lat: number; lng: number; kind: MapKind };

export type SceneOptions = {
  host: HTMLElement;
  /** Nhãn HTML theo khoá: "f21", "road", "west", "ring1", "ring5", "ring10" và khoá từng địa điểm */
  labels: Map<string, HTMLElement>;
  places: ScenePlace[];
  reducedMotion: boolean;
  /** Màu nền khối, để sương mù ở mép bản đồ hoà vào nền */
  fog: string;
};

export type MapScene = { start(): void; stop(): void; setActive(key: string | null): void; dispose(): void };

const C = {
  maroon: 0x8d191d,
  maroonDeep: 0x5e1215,
  gold: 0xc9a23f,
  goldLight: 0xe2be49,
  paper: 0xfffdf8,
  sand: 0xe6d8bf,
  ground: 0xf3ebdc,
  building: 0xf9f3e8,
  tree: 0x9fae80,
  treeDark: 0x7f9163,
  field: 0xa7bd86,
  water: 0x8dbab5,
};

const SCALE = 3;
const KM_LAT = 110.57;
const KM_LNG = 111.32 * Math.cos((MAP_HOTEL.lat * Math.PI) / 180);
const kmToR = (km: number) => SCALE * Math.sqrt(km);

function toScene(lat: number, lng: number) {
  const x = (lng - MAP_HOTEL.lng) * KM_LNG;
  const z = -(lat - MAP_HOTEL.lat) * KM_LAT;
  const d = Math.hypot(x, z);
  if (d < 1e-6) return new THREE.Vector3();
  const r = kmToR(d);
  return new THREE.Vector3((x / d) * r, 0, (z / d) * r);
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeBack = (t: number) => {
  const x = clamp01(t) - 1;
  return 1 + 2.70158 * x * x * x + 1.70158 * x * x;
};
const phase = (time: number, start: number, dur: number) => clamp01((time - start) / dur);

const std = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true, ...extra });

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Dải phẳng chạy dọc một đường cong (mặt đường, vạch kẻ). v của UV tính theo mét đường để vạch đứt đều nhau.
function ribbon(curve: THREE.Curve<THREE.Vector3>, width: number, y: number, segments: number, dash = 1) {
  const len = curve.getLength();
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    const nx = -tan.z * (width / 2);
    const nz = tan.x * (width / 2);
    pos.push(p.x + nx, y, p.z + nz, p.x - nx, y, p.z - nz);
    uv.push(0, (t * len) / dash, 1, (t * len) / dash);
    if (i < segments) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

type Landmark = { group: THREE.Group; top: number; spin?: THREE.Object3D };

function buildLandmark(kind: MapKind): Landmark {
  const g = new THREE.Group();
  switch (kind) {
    case "school": {
      g.add(mesh(new THREE.BoxGeometry(0.7, 0.3, 0.42), std(C.paper), 0, 0.15, 0));
      g.add(mesh(new THREE.BoxGeometry(0.78, 0.05, 0.5), std(C.maroon), 0, 0.325, 0));
      return { group: g, top: 0.45 };
    }
    case "park": {
      // Vòng quay của Thiên đường Bảo Sơn
      const wheel = new THREE.Group();
      wheel.add(mesh(new THREE.TorusGeometry(0.55, 0.026, 6, 40), std(C.gold, { metalness: 0.3 })));
      for (let i = 0; i < 6; i++) {
        const spoke = mesh(new THREE.BoxGeometry(0.014, 1.1, 0.014), std(C.gold));
        spoke.rotation.z = (i * Math.PI) / 6;
        wheel.add(spoke);
      }
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        wheel.add(mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), std(i % 2 ? C.maroon : C.paper), Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0));
      }
      wheel.position.y = 0.78;
      g.add(wheel);
      for (const z of [-0.1, 0.1]) {
        for (const s of [-1, 1]) {
          const leg = mesh(new THREE.BoxGeometry(0.035, 0.86, 0.035), std(C.maroonDeep), s * 0.14, 0.4, z);
          leg.rotation.z = s * 0.34;
          g.add(leg);
        }
      }
      return { group: g, top: 1.42, spin: wheel };
    }
    case "stadium": {
      // Mỹ Đình: lòng sân hình ô-van, vòm thép lớn vắt qua
      const bowl = mesh(new THREE.TorusGeometry(0.58, 0.17, 8, 40), std(C.paper), 0, 0.1, 0);
      bowl.rotation.x = Math.PI / 2;
      bowl.scale.z = 0.75;
      const field = mesh(new THREE.CircleGeometry(0.46, 32), std(C.field), 0, 0.02, 0);
      field.rotation.x = -Math.PI / 2;
      const arch = mesh(new THREE.TorusGeometry(0.72, 0.035, 8, 40, Math.PI), std(C.maroon), 0, 0.08, 0);
      g.add(bowl, field, arch);
      g.scale.z = 0.8;
      return { group: g, top: 0.85 };
    }
    case "hall": {
      g.add(mesh(new THREE.BoxGeometry(1.15, 0.28, 0.6), std(C.paper), 0, 0.14, 0));
      g.add(mesh(new THREE.BoxGeometry(1.36, 0.05, 0.8), std(C.gold, { metalness: 0.25 }), 0, 0.305, 0));
      for (let i = -2; i <= 2; i++) g.add(mesh(new THREE.BoxGeometry(0.03, 0.26, 0.03), std(C.maroon), i * 0.22, 0.13, 0.36));
      return { group: g, top: 0.45 };
    }
    case "lake": {
      // Hồ Hoàn Kiếm, Tháp Rùa và cầu Thê Húc
      const water = new THREE.Mesh(
        new THREE.CircleGeometry(0.62, 40),
        new THREE.MeshStandardMaterial({ color: C.water, roughness: 0.25, metalness: 0.1 }),
      );
      water.rotation.x = -Math.PI / 2;
      water.position.y = 0.012;
      water.scale.set(0.58, 1, 1);
      water.receiveShadow = true;
      g.add(water);
      g.add(mesh(new THREE.BoxGeometry(0.11, 0.12, 0.11), std(C.paper), 0, 0.07, 0.2));
      g.add(mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), std(C.paper), 0, 0.17, 0.2));
      const cap = mesh(new THREE.ConeGeometry(0.08, 0.08, 4), std(C.maroon), 0, 0.25, 0.2);
      cap.rotation.y = Math.PI / 4;
      g.add(cap);
      const bridge = mesh(new THREE.TorusGeometry(0.16, 0.02, 6, 16, Math.PI), std(C.maroon), 0.3, 0.01, -0.36);
      bridge.rotation.y = Math.PI / 2;
      g.add(bridge);
      return { group: g, top: 0.42 };
    }
  }
}

export function createMapScene({ host, labels, places, reducedMotion, fog }: SceneOptions): MapScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  const small = host.clientWidth < 600;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  host.insertBefore(renderer.domElement, host.firstChild);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color(fog), 24, 44);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
  const target = new THREE.Vector3(4.6, 0, -1.6);

  // Ánh sáng chiều ấm, đổ bóng nhẹ
  scene.add(new THREE.HemisphereLight(0xfff7ea, 0xd8c7a6, 2.2));
  const sun = new THREE.DirectionalLight(0xffe4b8, 2.6);
  sun.position.set(-7, 14, 9);
  sun.target.position.copy(target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -17, right: 17, top: 17, bottom: -17, near: 1, far: 50 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 96), new THREE.MeshStandardMaterial({ color: C.ground, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Vòng khoảng cách thật 1, 5, 10 km quanh F21
  const anchors = new Map<string, THREE.Vector3>();
  const ringMats: THREE.MeshBasicMaterial[] = [];
  for (const km of [1, 5, 10]) {
    const r = kmToR(km);
    const mat = new THREE.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.014, r + 0.014, 180), mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.006;
    scene.add(ring);
    ringMats.push(mat);
    const a = 2.25; // phía tây nam, gần người xem
    anchors.set(`ring${km}`, new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
  }

  // Sóng lan ra từ F21
  const pulseMats: THREE.MeshBasicMaterial[] = [];
  const pulses = [0, 1, 2].map(() => {
    const mat = new THREE.MeshBasicMaterial({ color: C.maroon, transparent: true, opacity: 0, depthWrite: false });
    pulseMats.push(mat);
    const m = new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 72), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.01;
    scene.add(m);
    return m;
  });

  // Đại lộ Thăng Long: viền, mặt đường, vạch giữa chạy như dòng xe
  const roadCurve = new THREE.CatmullRomCurve3(
    MAP_ROAD.points.map(([lat, lng]) => toScene(lat, lng)),
    false,
    "centripetal",
  );
  const ROAD_SEG = 220;
  const dashTex = canvasTexture(4, 32, (g) => {
    g.fillStyle = "#fff";
    g.fillRect(0, 0, 4, 18);
  });
  dashTex.wrapS = dashTex.wrapT = THREE.RepeatWrapping;
  const roadMeshes = [
    new THREE.Mesh(ribbon(roadCurve, 0.5, 0.008, ROAD_SEG), new THREE.MeshStandardMaterial({ color: C.sand, roughness: 1 })),
    new THREE.Mesh(ribbon(roadCurve, 0.38, 0.012, ROAD_SEG), new THREE.MeshStandardMaterial({ color: C.paper, roughness: 0.9 })),
    new THREE.Mesh(
      ribbon(roadCurve, 0.035, 0.016, ROAD_SEG, 0.45),
      new THREE.MeshBasicMaterial({ color: C.gold, map: dashTex, transparent: true, alphaTest: 0.5 }),
    ),
  ];
  for (const m of roadMeshes) {
    m.receiveShadow = true;
    m.geometry.setDrawRange(0, 0);
    scene.add(m);
  }
  anchors.set("road", roadCurve.getPointAt(0.4).setY(0.05));
  anchors.set("west", roadCurve.getPointAt(0.02).setY(0.05));

  // Xe chạy hai chiều trên đại lộ
  const carGeo = new THREE.BoxGeometry(0.13, 0.06, 0.07);
  const cars = Array.from({ length: small ? 6 : 10 }, (_, i) => {
    const m = mesh(carGeo, std([C.maroon, C.gold, C.paper, C.maroonDeep][i % 4]));
    m.visible = false;
    scene.add(m);
    return { m, u: i / (small ? 6 : 10), dir: i % 2 ? 1 : -1, speed: 0.022 + (i % 3) * 0.006 };
  });

  // F21: toà nhà đỏ mận, ghim vàng nổi phía trên, cột sáng
  const hotel = new THREE.Group();
  hotel.add(mesh(new THREE.CylinderGeometry(0.66, 0.72, 0.08, 48), std(C.paper, { flatShading: false }), 0, 0.04, 0));
  hotel.add(mesh(new THREE.BoxGeometry(0.58, 1.0, 0.46), std(C.maroon), 0, 0.58, 0));
  for (const y of [0.36, 0.6, 0.84]) hotel.add(mesh(new THREE.BoxGeometry(0.44, 0.05, 0.02), std(C.goldLight), 0, y, 0.235));
  const roof = mesh(new THREE.ConeGeometry(0.43, 0.32, 4), std(C.gold, { metalness: 0.3 }), 0, 1.24, 0);
  roof.rotation.y = Math.PI / 4;
  hotel.add(roof);
  scene.add(hotel);

  const pin = new THREE.Group();
  const pinMat = std(C.maroon, { flatShading: false, roughness: 0.5 });
  pin.add(mesh(new THREE.SphereGeometry(0.22, 24, 16), pinMat));
  const tip = mesh(new THREE.ConeGeometry(0.2, 0.4, 24), pinMat, 0, -0.24, 0);
  tip.rotation.x = Math.PI;
  pin.add(tip);
  pin.add(mesh(new THREE.TorusGeometry(0.11, 0.035, 10, 24), std(C.goldLight, { flatShading: false, metalness: 0.4 }), 0, 0, 0.2));
  pin.position.y = 2.1;
  scene.add(pin);

  const beamTex = canvasTexture(4, 64, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(255,255,255,1)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 4, 64);
  });
  const beamMat = new THREE.MeshBasicMaterial({
    color: C.goldLight,
    map: beamTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 5, 32, 1, true), beamMat);
  beam.position.y = 2.5;
  scene.add(beam);
  anchors.set("f21", new THREE.Vector3(0, 2.6, 0));

  // Các địa điểm, xếp theo khoảng cách để hiện lần lượt từ gần ra xa
  const spots = places
    .map((p) => ({ ...p, pos: toScene(p.lat, p.lng) }))
    .sort((a, b) => a.pos.length() - b.pos.length())
    .map((p) => {
      const lm = buildLandmark(p.kind);
      lm.group.position.copy(p.pos);
      lm.group.scale.setScalar(0.0001);
      scene.add(lm.group);
      anchors.set(p.key, p.pos.clone().setY(lm.top));
      return { ...p, lm, baseScaleZ: p.kind === "stadium" ? 0.8 : 1 };
    });

  // Đường bay từ F21 tới từng địa điểm, có đốm sáng chạy dọc
  const glowTex = canvasTexture(64, 64, (g) => {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  });
  const ROUTE_SEG = 90;
  const ROUTE_RAD = 6;
  const routes = spots.map((p, i) => {
    const from = new THREE.Vector3(0, 0.08, 0);
    const to = p.pos.clone().setY(0.08);
    const len = from.distanceTo(to);
    const mid = from.clone().lerp(to, 0.5).setY(0.5 + len * 0.3);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const mat = new THREE.MeshBasicMaterial({ color: C.maroon, transparent: true, opacity: 0.7 });
    const line = new THREE.Mesh(new THREE.TubeGeometry(curve, ROUTE_SEG, 0.026, ROUTE_RAD, false), mat);
    line.geometry.setDrawRange(0, 0);
    scene.add(line);
    const comet = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 12, 8),
      new THREE.MeshBasicMaterial({ color: C.goldLight }),
    );
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowTex, color: C.goldLight, transparent: true, depthWrite: false, opacity: 0.9 }),
    );
    glow.scale.setScalar(0.5);
    comet.add(glow);
    comet.visible = false;
    scene.add(comet);
    return { key: p.key, curve, mat, line, comet, offset: i * 0.29, opacity: 0.7 };
  });

  // Phố xá: phía đông (nội thành) dày và cao dần, quanh F21 là biệt thự thấp và cây xanh
  const rand = mulberry32(21);
  const roadSamples = roadCurve.getSpacedPoints(160);
  const nearRoad = (x: number, z: number, gap: number) => roadSamples.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < gap * gap);
  const nearSpot = (x: number, z: number) => spots.some((s) => (s.pos.x - x) ** 2 + (s.pos.z - z) ** 2 < 1.0);
  const nearRoute = (x: number, z: number) =>
    spots.some((s) => {
      // khoảng cách tới đoạn thẳng F21 → địa điểm (hình chiếu đường bay xuống mặt đất)
      const t = clamp01((x * s.pos.x + z * s.pos.z) / s.pos.lengthSq());
      return (x - s.pos.x * t) ** 2 + (z - s.pos.z * t) ** 2 < 0.09;
    });
  type Block = { x: number; z: number; w: number; h: number; d: number; delay: number };
  const blocks: Block[] = [];
  const villas: Block[] = [];
  const trees: Block[] = [];
  for (let x = -14; x <= 16; x += 0.6) {
    for (let z = -11; z <= 9; z += 0.6) {
      const jx = x + (rand() - 0.5) * 0.32;
      const jz = z + (rand() - 0.5) * 0.32;
      const r = Math.hypot(jx, jz);
      const roll = rand();
      const size = rand();
      if (r > 17 || r < 0.95 || nearSpot(jx, jz) || nearRoad(jx, jz, 0.42)) continue;
      const delay = 0.25 + r * 0.085;
      if (r < 2.4) {
        if (roll < 0.45) trees.push({ x: jx, z: jz, w: 0.8 + size * 0.5, h: 0.8 + size * 0.6, d: 0, delay });
        else if (roll < 0.75 && !nearRoute(jx, jz)) villas.push({ x: jx, z: jz, w: 0.26, h: 0.16 + size * 0.06, d: 0.24, delay });
        continue;
      }
      const east = THREE.MathUtils.smoothstep(jx, -1, 12);
      if (roll < 0.08 + east * 0.4) {
        if (nearRoute(jx, jz)) continue;
        const h = 0.1 + Math.pow(size, 2.6) * (0.2 + east * 0.75);
        blocks.push({ x: jx, z: jz, w: 0.22 + rand() * 0.22, h, d: 0.22 + rand() * 0.22, delay });
      } else if (roll < 0.08 + east * 0.4 + (1 - east) * 0.3) {
        trees.push({ x: jx, z: jz, w: 0.8 + size * 0.5, h: 0.8 + size * 0.6, d: 0, delay });
      }
    }
  }

  const unitBox = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const instanced = (geo: THREE.BufferGeometry, mat: THREE.Material, list: Block[], colors: number[]) => {
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    im.castShadow = true;
    im.receiveShadow = true;
    const col = new THREE.Color();
    list.forEach((_, i) => im.setColorAt(i, col.setHex(colors[i % colors.length])));
    scene.add(im);
    return im;
  };
  const blockMesh = instanced(unitBox, std(0xffffff), blocks, [C.building, 0xf2e8d6, 0xfbf7ef, 0xeee2cc]);
  const villaMesh = instanced(unitBox, std(0xffffff), villas, [C.paper, 0xf4ead8]);
  const treeGeo = new THREE.IcosahedronGeometry(0.15, 0).translate(0, 0.2, 0);
  const treeMesh = instanced(treeGeo, std(0xffffff), trees, [C.tree, C.treeDark, 0xb0bb8c]);

  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const v = new THREE.Vector3();
  const s = new THREE.Vector3();
  const placeInstances = (time: number) => {
    let moving = false;
    const set = (im: THREE.InstancedMesh, list: Block[], scaleOf: (b: Block, k: number) => [number, number, number]) => {
      list.forEach((b, i) => {
        const p = phase(time, b.delay, 0.8);
        if (p < 1) moving = true;
        const k = Math.max(0.0001, easeOut(p));
        m4.compose(v.set(b.x, 0, b.z), q, s.set(...scaleOf(b, k)));
        im.setMatrixAt(i, m4);
      });
      im.instanceMatrix.needsUpdate = true;
    };
    set(blockMesh, blocks, (b, k) => [b.w, b.h * k, b.d]);
    set(villaMesh, villas, (b, k) => [b.w, b.h * k, b.d]);
    set(treeMesh, trees, (b, k) => [b.w * k, b.h * k, b.w * k]);
    return moving;
  };

  // Mái đỏ cho biệt thự Hoa Phượng
  const roofMesh = new THREE.InstancedMesh(new THREE.ConeGeometry(0.21, 0.12, 4).rotateY(Math.PI / 4), std(C.maroon), villas.length);
  roofMesh.castShadow = true;
  scene.add(roofMesh);
  const placeRoofs = (time: number) => {
    villas.forEach((b, i) => {
      const k = Math.max(0.0001, easeOut(phase(time, b.delay + 0.3, 0.6)));
      m4.compose(v.set(b.x, b.h + 0.06 * k, b.z), q, s.set(k, k, k));
      roofMesh.setMatrixAt(i, m4);
    });
    roofMesh.instanceMatrix.needsUpdate = true;
  };

  // Bề rộng nhãn chỉ đo lại khi đổi cỡ khung, tránh bắt trình duyệt tính lại bố cục mỗi khung hình
  const labelWidth = new Map<string, number>();

  // ---- Máy quay ----
  let width = 1;
  let height = 1;
  let radius = 19;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const placeCamera = (intro: number, time: number) => {
    const k = easeOut(intro);
    const sway = reducedMotion ? 0 : Math.sin(time * 0.26) * 0.12 * k;
    const az = THREE.MathUtils.lerp(0.1, -0.62, k) + sway + pointer.x * 0.1;
    const pol = THREE.MathUtils.lerp(0.12, 0.95, k) + pointer.y * 0.05;
    const r = radius * THREE.MathUtils.lerp(1.35, 1, k);
    camera.position.set(
      target.x + Math.sin(az) * Math.sin(pol) * r,
      Math.cos(pol) * r,
      target.z + Math.cos(az) * Math.sin(pol) * r,
    );
    camera.lookAt(target);
  };

  const resize = () => {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    // Khung hẹp (điện thoại) lùi máy xa hơn để vẫn thấy từ Hoà Lạc tới Hoàn Kiếm
    radius = 19.5 * Math.max(1, 1.15 / camera.aspect);
    target.x = camera.aspect < 1 ? 3.8 : 4.6;
    labelWidth.clear();
    camera.updateProjectionMatrix();
  };
  resize();

  // ---- Nhãn ----
  const labelPos = new THREE.Vector3();
  const labelOpacity = new Map<string, number>();
  const placeLabels = () => {
    for (const [key, el] of labels) {
      const anchor = anchors.get(key);
      if (!anchor) continue;
      labelPos.copy(anchor).project(camera);
      let half = labelWidth.get(key);
      if (!half) labelWidth.set(key, (half = el.offsetWidth / 2));
      // Nhãn sát mép thì đẩy vào trong khung thay vì để bị cắt chữ
      const x = Math.min(Math.max(((labelPos.x + 1) / 2) * width, half + 6), width - half - 6);
      const y = ((1 - labelPos.y) / 2) * height;
      const inView = labelPos.z < 1 && x > -40 && x < width + 40 && y > -20 && y < height + 40;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = inView ? String(labelOpacity.get(key) ?? 0) : "0";
    }
  };

  // ---- Làm nổi bật một địa điểm ----
  let userActive: string | null = null;
  let tourIndex = -1;
  let tourAt = 0;
  let active: string | null = null;
  const applyActive = (key: string | null) => {
    if (key === active) return;
    active = key;
    for (const [k, el] of labels) el.classList.toggle("is-active", k === key);
  };

  // ---- Vòng lặp ----
  let last = 0;
  let elapsed = reducedMotion ? 99 : 0;
  let introDone = false;
  let raf = 0;
  let running = false;

  const frame = (dt: number) => {
    const t = elapsed;
    const intro = reducedMotion ? 1 : phase(t, 0, 2.8);

    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
    placeCamera(intro, t);

    if (!introDone) {
      const moving = placeInstances(t);
      placeRoofs(t);
      ringMats.forEach((m, i) => (m.opacity = 0.55 * easeOut(phase(t, 0.3 + i * 0.25, 1))));
      const road = easeOut(phase(t, 0.4, 1.6));
      for (const m of roadMeshes) m.geometry.setDrawRange(0, Math.floor(road * ROAD_SEG) * 6);
      const h = easeBack(phase(t, 0.15, 0.9));
      hotel.scale.set(h, h, h);
      labelOpacity.set("f21", phase(t, 0.7, 0.5));
      labelOpacity.set("road", phase(t, 1.5, 0.6));
      labelOpacity.set("west", phase(t, 1.7, 0.6) * 0.9);
      ["ring1", "ring5", "ring10"].forEach((k, i) => labelOpacity.set(k, phase(t, 1 + i * 0.25, 0.6)));
      spots.forEach((p, i) => {
        const start = 0.9 + i * 0.32;
        const k = Math.max(0.0001, easeBack(phase(t, start, 0.7)));
        p.lm.group.scale.set(k, k, k * p.baseScaleZ);
        labelOpacity.set(p.key, phase(t, start + 0.45, 0.5));
        const draw = easeOut(phase(t, start - 0.1, 0.9));
        routes[i].line.geometry.setDrawRange(0, Math.floor(draw * ROUTE_SEG) * ROUTE_RAD * 6);
      });
      if (!moving && t > 4.5) {
        introDone = true;
        cars.forEach((c) => (c.m.visible = true));
        routes.forEach((r) => (r.comet.visible = !reducedMotion));
      }
    }

    // Tự lần lượt làm nổi bật từng địa điểm; khách rê chuột vào nhãn thì theo nhãn đó
    if (introDone && !reducedMotion && t - tourAt > 3.2) {
      tourAt = t;
      tourIndex = (tourIndex + 1) % spots.length;
    }
    applyActive(userActive ?? (introDone && !reducedMotion ? spots[tourIndex]?.key ?? null : null));

    routes.forEach((r) => {
      const goal = active ? (r.key === active ? 1 : 0.22) : 0.7;
      r.opacity += (goal - r.opacity) * Math.min(1, dt * 5);
      r.mat.opacity = r.opacity;
      if (r.comet.visible) {
        const speed = r.key === active ? 0.42 : 0.24;
        r.comet.position.copy(r.curve.getPoint((t * speed + r.offset) % 1));
        (r.comet.children[0] as THREE.Sprite).material.opacity = r.key === active || !active ? 0.9 : 0.35;
      }
    });

    if (!reducedMotion) {
      pulses.forEach((m, i) => {
        const p = (t / 2.6 + i / 3) % 1;
        const sc = 0.5 + p * kmToR(1) * 1.05;
        m.scale.set(sc, sc, sc);
        pulseMats[i].opacity = introDone ? (1 - p) * 0.45 : 0;
      });
      pin.position.y = 2.1 + Math.sin(t * 2) * 0.08;
      pin.rotation.y = t * 1.2;
      beamMat.opacity = (0.32 + Math.sin(t * 1.6) * 0.06) * easeOut(phase(t, 0.6, 1));
      dashTex.offset.y -= dt * 0.6;
      for (const sp of spots) if (sp.lm.spin) sp.lm.spin.rotation.z -= dt * 0.35;
      if (introDone) {
        for (const c of cars) {
          c.u = (c.u + c.dir * c.speed * dt + 1) % 1;
          const p = roadCurve.getPointAt(c.u);
          const tan = roadCurve.getTangentAt(c.u);
          c.m.position.set(p.x - tan.z * 0.09 * c.dir, 0.05, p.z + tan.x * 0.09 * c.dir);
          c.m.rotation.y = Math.atan2(-tan.z, tan.x);
        }
      }
    } else {
      beamMat.opacity = 0.32;
      pin.position.y = 2.1;
    }

    placeLabels();
    renderer.render(scene, camera);
  };

  const loop = () => {
    if (!running) return;
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    frame(dt);
    raf = requestAnimationFrame(loop);
  };

  const renderOnce = () => frame(0);

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = host.getBoundingClientRect();
    pointer.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  const onLeave = () => {
    pointer.tx = 0;
    pointer.ty = 0;
  };
  if (!reducedMotion) {
    host.addEventListener("pointermove", onPointer);
    host.addEventListener("pointerleave", onLeave);
  }

  const ro = new ResizeObserver(() => {
    resize();
    if (!running) renderOnce();
  });
  ro.observe(host);

  return {
    start() {
      if (reducedMotion) {
        renderOnce();
        return;
      }
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    setActive(key) {
      userActive = key;
      if (key) tourAt = elapsed; // khách thôi rê chuột thì nghỉ một nhịp rồi mới đi tiếp
      if (!running) renderOnce();
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mat) => mat.dispose());
      });
      [dashTex, beamTex, glowTex].forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
