// SIM — the portfolio as a live point cloud.
// Each plate is scattered into points and pushed out along its depth map, so a still
// becomes a volume you can tilt. Turbulence carries the points from one project to the
// next, and the pointer leaves a hot wake that lifts whatever it passes over.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  ClampToEdgeWrapping,
  Group,
  LinearFilter,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
} from "three";
import "./sim.css";
import { aboutShot, esc, metaLine, projects, reducedMotion, site, type Shot } from "../core/data";
import { aboutHTML, detailHTML } from "../core/detail";

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0; vec4 s1 = floor(b1) * 2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0); m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
vec3 turbulence(vec3 p){
  return vec3(snoise(p), snoise(p + vec3(31.3, 17.1, 5.7)), snoise(p + vec3(-11.5, 47.2, 23.9)));
}`;

const VERT = /* glsl */ `
uniform sampler2D tA; uniform sampler2D tB; uniform sampler2D dA; uniform sampler2D dB; uniform sampler2D tTrail;
uniform vec4 uWinA; uniform vec4 uWinB;
uniform float uT; uniform float uDir; uniform float uTime; uniform float uAspect; uniform float uOver;
uniform float uCell; uniform float uDepth; uniform float uAssemble; uniform float uScatter; uniform float uCalm;
uniform vec3 uHeat;
varying vec3 vCol; varying float vAlpha;
${NOISE}
float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
void main(){
  vec2 g = position.xy;           // where this point sits in the frame, 0..1
  float h = position.z;           // its own random number

  // A front sweeps across the frame; each point lets go a little before or after it.
  float lead = (uDir > 0.0 ? g.x : 1.0 - g.x) * 0.55 + h * 0.2;
  float m = smoothstep(lead, lead + 0.25, uT);
  float bell = sin(3.14159265 * m);

  vec2 uvA = uWinA.xy + (g - 0.5) * uWinA.zw;
  vec2 uvB = uWinB.xy + (g - 0.5) * uWinB.zw;
  vec3 col = mix(texture2D(tA, uvA).rgb, texture2D(tB, uvB).rgb, m);
  float z = mix(texture2D(dA, uvA).r, texture2D(dB, uvB).r, m);

  vec3 home = vec3((g.x - 0.5) * uAspect * uOver, (g.y - 0.5) * uOver, (z - 0.5) * uDepth);
  float heat = texture2D(tTrail, g).r;
  float held = smoothstep(h * 0.55, h * 0.55 + 0.45, uAssemble);
  float gust = exp(-pow((g.x + g.y * 0.25 - fract(uTime * 0.07) * 2.0 + 0.4) * 4.5, 2.0));

  vec3 flow = turbulence(home * 1.25 + vec3(h * 0.15, 0.0, uTime * 0.07));
  float loose = 0.0035 + gust * 0.02 + bell * 0.24 + heat * 0.07 + (1.0 - held) * 0.95 + uScatter * 0.05;
  loose *= mix(1.0, 0.12, uCalm);
  vec3 pos = home + flow * loose;
  pos.x += bell * 0.18 * uDir * (0.4 + h);
  pos.z += heat * 0.16 + bell * 0.1 * (h - 0.3);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  col = pow(col, vec3(0.82)) * 1.2;
  float l = luma(col);
  // halftone logic: bright points are large, dark points shrink to nothing
  float size = uCell * mix(0.5, 1.32, sqrt(l)) * (0.9 + 0.35 * z) * (1.0 + 0.9 * bell + 1.2 * heat) * (2.0 / -mv.z);
  gl_PointSize = clamp(size, 1.0, 22.0);
  vCol = col * mix(0.8, 1.15, z);
  float hot = min(heat * heat * 1.6, 0.7);
  vCol = mix(vCol, uHeat * (0.3 + 1.3 * l), hot) + uHeat * hot * 0.12;
  vAlpha = smoothstep(0.015, 0.14, l + heat * 0.3) * mix(0.25, 1.0, held) * (1.0 - 0.45 * uScatter);
  if (vAlpha < 0.01) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vCol; varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.28, d) * vAlpha;
  gl_FragColor = vec4(vCol * a, a);
}`;

interface Plate {
  map: Texture;
  depth: Texture;
  aspect: number;
}

export function mount(root: HTMLElement): () => void {
  const list: Shot[] = [...projects, aboutShot];
  const calm = reducedMotion();
  const coarse = matchMedia("(pointer: coarse)").matches;

  root.innerHTML = `
  <div class="sim" data-state="loading">
    <canvas class="sm-gl" aria-hidden="true"></canvas>
    <div class="sm-shade"></div>
    <header class="sm-top">
      <span class="sm-mark">V1SU4</span>
      <nav class="sm-nav" aria-label="Site">
        <button data-about>About</button>
        <a href="${site.contactUrl}" target="_blank" rel="noopener">Contact</a>
      </nav>
    </header>
    <ol class="sm-index" aria-label="Projects">
      ${list.map((s, i) => `<li><button data-go="${i}">${esc(s.kind === "about" ? "About Gordo" : s.title)}</button></li>`).join("")}
    </ol>
    <main class="sm-card">
      <h1 class="sm-title"></h1>
      <p class="sm-line"></p>
      <p class="sm-meta"></p>
      <div class="sm-actions">
        <button class="sm-open"></button>
        <a class="sm-ext" target="_blank" rel="noopener"></a>
      </div>
    </main>
    <footer class="sm-foot">
      <div class="sm-step">
        <button data-step="-1" aria-label="Previous project">Prev</button>
        <span class="sm-count"></span>
        <button data-step="1" aria-label="Next project">Next</button>
      </div>
      <p class="sm-readout" aria-hidden="true"></p>
    </footer>
    <section class="sm-sheet" hidden aria-label="Project details">
      <button class="sm-close">Close</button>
      <div class="sm-sheet-in rd-detail"></div>
    </section>
  </div>`;

  const $ = <T extends HTMLElement>(sel: string) => root.querySelector(sel) as T;
  const el = $(".sim");
  const canvas = $<HTMLCanvasElement>(".sm-gl");
  const card = $(".sm-card");
  const title = $(".sm-title");
  const line = $(".sm-line");
  const meta = $(".sm-meta");
  const open = $<HTMLButtonElement>(".sm-open");
  const ext = $<HTMLAnchorElement>(".sm-ext");
  const count = $(".sm-count");
  const readout = $(".sm-readout");
  const sheet = $(".sm-sheet");
  const sheetIn = $(".sm-sheet-in");
  const items = [...root.querySelectorAll<HTMLButtonElement>(".sm-index button")];

  // ---------- scene ----------
  let renderer: WebGLRenderer | null = null;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    renderer.setClearColor(0x050506, 1);
  } catch {
    renderer = null;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 2 : 1.5);
  const COUNT = coarse ? 90_000 : 190_000;
  const OVER = 1.14; // the cloud runs past the frame so tilting never shows an edge
  const FOV = 28;
  const DIST = 0.5 / Math.tan((FOV * Math.PI) / 360);
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 10);
  camera.position.z = DIST;
  const scene = new Scene();
  const group = new Group();
  scene.add(group);

  // The pointer's wake: a small canvas the vertex shader reads as heat.
  const trail = document.createElement("canvas");
  trail.width = 128;
  trail.height = 72;
  const tctx = trail.getContext("2d")!;
  tctx.fillStyle = "#000";
  tctx.fillRect(0, 0, trail.width, trail.height);
  const trailTex = new CanvasTexture(trail);
  trailTex.minFilter = trailTex.magFilter = LinearFilter;
  trailTex.generateMipmaps = false;

  const uniforms = {
    tA: { value: null as Texture | null },
    tB: { value: null as Texture | null },
    dA: { value: null as Texture | null },
    dB: { value: null as Texture | null },
    tTrail: { value: trailTex },
    uWinA: { value: new Vector4(0.5, 0.5, 1, 1) },
    uWinB: { value: new Vector4(0.5, 0.5, 1, 1) },
    uT: { value: 0 },
    uDir: { value: 1 },
    uTime: { value: 0 },
    uAspect: { value: 1.6 },
    uOver: { value: OVER },
    uCell: { value: 3 },
    uDepth: { value: 0.34 },
    uAssemble: { value: calm ? 1 : 0 },
    uScatter: { value: 0 },
    uCalm: { value: calm ? 1 : 0 },
    uHeat: { value: new Vector3(1.0, 0.27, 0.16) },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: FRAG,
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });
  let points: Points | null = null;
  let pointCount = 0;
  let vw = 1;
  let vh = 1;
  let top = 0;

  function build() {
    const box = el.getBoundingClientRect();
    vw = box.width;
    vh = box.height;
    top = box.top;
    const aspect = vw / vh;
    const cols = Math.round(Math.sqrt(COUNT * aspect));
    const rows = Math.round(COUNT / cols);
    pointCount = cols * rows;
    const data = new Float32Array(pointCount * 3);
    let k = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // scattered, not gridded: each point is jittered inside its cell
        data[k++] = (x + 0.5 + (Math.random() - 0.5) * 0.62) / cols;
        data[k++] = (y + 0.5 + (Math.random() - 0.5) * 0.62) / rows;
        data[k++] = Math.random();
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(data, 3));
    if (points) {
      group.remove(points);
      points.geometry.dispose();
    }
    points = new Points(geo, material);
    points.frustumCulled = false;
    group.add(points);
    uniforms.uAspect.value = aspect;
    uniforms.uCell.value = ((vh * OVER) / rows) * dpr * 1.05;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(vw, vh, false);
    if (cur >= 0) setWindow(uniforms.uWinA.value, list[cur], aspA);
    setWindow(uniforms.uWinB.value, list[Math.max(0, nextIdx)], aspB);
  }

  const loader = new TextureLoader();
  const cache = new Map<string, Promise<Plate>>();
  const prep = (t: Texture) => {
    t.minFilter = t.magFilter = LinearFilter;
    t.generateMipmaps = false;
    t.wrapS = t.wrapT = ClampToEdgeWrapping;
    return t;
  };
  const plateOf = (s: Shot) => {
    let p = cache.get(s.slug);
    if (!p) {
      p = Promise.all([loader.loadAsync(s.plate), loader.loadAsync(s.depth)]).then(([map, depth]) => ({
        map: prep(map),
        depth: prep(depth),
        aspect: map.image.width / map.image.height,
      }));
      cache.set(s.slug, p);
    }
    return p;
  };
  // Which part of a plate fills the frame: a cover fit that stays centred on the plate's focus.
  function setWindow(v: Vector4, s: Shot, asp: number) {
    const fr = vw / vh;
    const sx = fr > asp ? 1 : fr / asp;
    const sy = fr > asp ? asp / fr : 1;
    const cx = Math.min(1 - sx / 2, Math.max(sx / 2, s.focus[0]));
    const cy = Math.min(1 - sy / 2, Math.max(sy / 2, 1 - s.focus[1]));
    v.set(cx, cy, sx, sy);
  }

  // ---------- state ----------
  let cur = -1;
  let nextIdx = 0;
  let aspA = 1.78;
  let aspB = 1.78;
  let busy = false;
  let queued: number | null = null;
  let sheetOpen = false;
  let raf = 0;
  let last = performance.now();
  let time = 0;
  let trans: { start: number; dur: number; to: number; swapped: boolean } | null = null;
  let asmStart = -1;
  const ptr = new Vector2(0, 0); // -1..1
  const ptrPx = new Vector2(-1, -1);
  const ptrPrev = new Vector2(-1, -1);
  let ptrSeen = 0;
  let fps = 60;
  let fpsAt = 0;

  function setCard(i: number) {
    const s = list[i];
    title.textContent = s.title;
    line.textContent = s.line;
    meta.textContent = metaLine(s);
    meta.hidden = s.kind !== "project";
    open.textContent = s.kind === "about" ? "About Gordo" : "View project";
    const link = s.entry?.link;
    ext.hidden = !link;
    if (link) {
      ext.href = link;
      ext.textContent = s.entry!.linkLabel ?? `Open ${new URL(link).hostname.replace(/^www\./, "")}`;
    }
    count.textContent = `${i + 1} of ${list.length}`;
    items.forEach((b, j) => b.toggleAttribute("aria-current", j === i));
  }

  async function go(to: number, dir?: number) {
    to = (to + list.length) % list.length;
    if (to === cur) return;
    if (busy) {
      queued = to;
      return;
    }
    busy = true;
    nextIdx = to;
    card.classList.add("is-out");
    const p = await plateOf(list[to]);
    aspB = p.aspect;
    uniforms.tB.value = p.map;
    uniforms.dB.value = p.depth;
    setWindow(uniforms.uWinB.value, list[to], aspB);
    uniforms.uDir.value = dir ?? (to > cur ? 1 : -1);
    trans = { start: performance.now(), dur: calm ? 500 : 1900, to, swapped: false };
    void plateOf(list[(to + 1) % list.length]);
  }

  function openSheet() {
    const s = list[cur];
    sheetIn.innerHTML = s.kind === "about" ? aboutHTML() : detailHTML(s);
    sheet.hidden = false;
    sheet.scrollTop = 0;
    requestAnimationFrame(() => el.classList.add("is-sheet"));
    sheetOpen = true;
    $(".sm-close").focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;
    el.classList.remove("is-sheet");
    window.setTimeout(() => {
      if (!sheetOpen) sheet.hidden = true;
    }, 500);
    open.focus({ preventScroll: true });
  }

  function paintTrail(dt: number) {
    tctx.globalCompositeOperation = "source-over";
    tctx.fillStyle = `rgba(0,0,0,${Math.min(1, dt * 1.6)})`;
    tctx.fillRect(0, 0, trail.width, trail.height);
    if (ptrPx.x >= 0 && !sheetOpen && performance.now() - ptrSeen < 400) {
      const speed = ptrPrev.x < 0 ? 0 : Math.hypot(ptrPx.x - ptrPrev.x, ptrPx.y - ptrPrev.y);
      const power = Math.min(1, 0.12 + speed / 26);
      // frame px -> grid uv (the cloud is larger than the frame by OVER)
      const u = 0.5 + (ptrPx.x / vw - 0.5) / OVER;
      const v = 0.5 + (ptrPx.y / vh - 0.5) / OVER;
      const x = u * trail.width;
      const y = v * trail.height;
      const r = trail.width * (coarse ? 0.1 : 0.07);
      const grad = tctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(255,255,255,${power})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      tctx.globalCompositeOperation = "lighter";
      tctx.fillStyle = grad;
      tctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    ptrPrev.copy(ptrPx);
    trailTex.needsUpdate = true;
  }

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    time += dt;
    uniforms.uTime.value = time;
    fps += (1 / Math.max(dt, 0.001) - fps) * 0.05;

    if (asmStart >= 0) {
      const k = Math.min(1, (now - asmStart) / 3200);
      uniforms.uAssemble.value = 1 - Math.pow(1 - k, 3);
      if (k >= 1) asmStart = -1;
    }
    uniforms.uScatter.value += ((sheetOpen ? 1 : 0) - uniforms.uScatter.value) * Math.min(1, dt * 4);

    if (trans) {
      const k = Math.min(1, (now - trans.start) / trans.dur);
      uniforms.uT.value = k;
      if (!trans.swapped && k >= 0.45) {
        trans.swapped = true;
        cur = trans.to;
        setCard(cur);
        card.classList.remove("is-out");
      }
      if (k >= 1) {
        uniforms.tA.value = uniforms.tB.value;
        uniforms.dA.value = uniforms.dB.value;
        uniforms.uWinA.value.copy(uniforms.uWinB.value);
        aspA = aspB;
        uniforms.uT.value = 0;
        trans = null;
        busy = false;
        if (queued !== null) {
          const q = queued;
          queued = null;
          void go(q);
        }
      }
    }

    // tilt the volume toward the pointer; drift on its own when there is no pointer
    const idle = now - ptrSeen > 2500;
    const tx = idle ? Math.sin(time * 0.33) * 0.55 : ptr.x;
    const ty = idle ? Math.cos(time * 0.27) * 0.4 : ptr.y;
    const tilt = calm ? 0 : 1;
    group.rotation.y += (tx * 0.085 * tilt - group.rotation.y) * Math.min(1, dt * 2.5);
    group.rotation.x += (ty * 0.06 * tilt - group.rotation.x) * Math.min(1, dt * 2.5);

    paintTrail(dt);
    if (now - fpsAt > 500) {
      fpsAt = now;
      readout.textContent = `${pointCount.toLocaleString("en-US")} points, ${Math.round(fps)} fps`;
    }
    renderer?.render(scene, camera);
  }

  // ---------- input ----------
  const on = <K extends keyof WindowEventMap>(k: K, fn: (e: WindowEventMap[K]) => void, opt?: AddEventListenerOptions) => {
    window.addEventListener(k, fn, opt);
    return () => window.removeEventListener(k, fn, opt);
  };
  let wheelAcc = 0;
  let wheelAt = 0;
  let resizeT = 0;
  const offs = [
    on("resize", () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(build, 120);
    }),
    on("pointermove", (e) => {
      ptrPx.set(e.clientX, e.clientY - top);
      ptr.set((e.clientX / vw - 0.5) * 2, ((e.clientY - top) / vh - 0.5) * 2);
      ptrSeen = performance.now();
    }),
    on("pointerdown", (e) => {
      ptrPx.set(e.clientX, e.clientY - top);
      ptrPrev.set(e.clientX, e.clientY - top);
      ptrSeen = performance.now();
    }),
    on("keydown", (e) => {
      if (e.key === "Escape") return closeSheet();
      if (sheetOpen) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") void go(cur + 1, 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") void go(cur - 1, -1);
      else return;
      e.preventDefault();
    }),
    on(
      "wheel",
      (e) => {
        if (sheetOpen) return;
        const now = performance.now();
        if (now - wheelAt > 260) wheelAcc = 0;
        wheelAt = now;
        wheelAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(wheelAcc) > 60 && !busy) {
          void go(cur + Math.sign(wheelAcc), Math.sign(wheelAcc));
          wheelAcc = 0;
        }
      },
      { passive: true },
    ),
  ];
  // touch: stir the points while the finger moves; a quick sideways flick changes project
  let sx = 0;
  let sy = 0;
  let st = 0;
  canvas.addEventListener("touchstart", (e) => ((sx = e.touches[0].clientX), (sy = e.touches[0].clientY), (st = performance.now())), { passive: true });
  canvas.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (performance.now() - st < 450 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) void go(cur - Math.sign(dx), -Math.sign(dx));
    },
    { passive: true },
  );
  el.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-go],[data-step],[data-about],.sm-open,.sm-close");
    if (!t) return;
    if (t.dataset.go !== undefined) void go(Number(t.dataset.go));
    else if (t.dataset.step) void go(cur + Number(t.dataset.step), Number(t.dataset.step));
    else if (t.hasAttribute("data-about")) {
      const i = list.length - 1;
      if (cur === i) openSheet();
      else {
        void go(i, 1);
        window.setTimeout(openSheet, calm ? 600 : 1500);
      }
    } else if (t.classList.contains("sm-open")) openSheet();
    else if (t.classList.contains("sm-close")) closeSheet();
  });

  // ---------- start ----------
  build();
  card.classList.add("is-out");
  plateOf(list[0])
    .then((p) => {
      aspA = aspB = p.aspect;
      uniforms.tA.value = uniforms.tB.value = p.map;
      uniforms.dA.value = uniforms.dB.value = p.depth;
      cur = 0;
      setWindow(uniforms.uWinA.value, list[0], aspA);
      setWindow(uniforms.uWinB.value, list[0], aspB);
      setCard(0);
      el.dataset.state = "ready";
      asmStart = calm ? -1 : performance.now();
      window.setTimeout(() => card.classList.remove("is-out"), calm ? 0 : 1400);
      void plateOf(list[1]);
    })
    .catch(() => {
      cur = 0;
      setCard(0);
      el.dataset.state = "ready";
      el.style.backgroundImage = `url('${list[0].plate}')`;
      card.classList.remove("is-out");
    });
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(resizeT);
    offs.forEach((off) => off());
    cache.forEach((p) => void p.then((x) => (x.map.dispose(), x.depth.dispose())).catch(() => {}));
    points?.geometry.dispose();
    material.dispose();
    trailTex.dispose();
    renderer?.dispose();
    root.innerHTML = "";
  };
}
