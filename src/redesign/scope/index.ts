// SCOPE — the portfolio as a 2.39:1 screening.
// Every project is a shot. Stills are graded live in one fragment shader: depth
// parallax, a slow push-in, anamorphic highlight streaks, 24 fps grain and gate
// weave. Shots change on a whip pan while the title de-squeezes like scope footage.
import {
  ClampToEdgeWrapping,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import "./scope.css";
import { aboutShot, esc, metaLine, projects, reducedMotion, site, titleShot, type Shot } from "../core/data";
import { aboutHTML, detailHTML } from "../core/detail";

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D tA; uniform sampler2D tB; uniform sampler2D dA; uniform sampler2D dB;
uniform vec2 uRes; uniform float uAspA; uniform float uAspB; uniform vec2 uFocA; uniform vec2 uFocB;
uniform float uT; uniform float uDir; uniform vec2 uPtr; uniform float uTime;
uniform float uAgeA; uniform float uAgeB; uniform float uOpen; uniform float uDim; uniform float uCalm;
uniform float uGrain; uniform vec3 uFlare;

float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

// Visible window of a plate: cover fit around its focus, with overscan for parallax and a slow push-in.
vec4 window(float asp, vec2 foc, float age){
  float fr = uRes.x / uRes.y;
  vec2 s = fr > asp ? vec2(1.0, asp / fr) : vec2(fr / asp, 1.0);
  float push = 1.0 - exp(-age * 0.11);
  s *= 0.94 - 0.05 * push * (1.0 - uCalm);
  vec2 c = clamp(foc, s * 0.5, 1.0 - s * 0.5);
  return vec4(c, s);
}
// Depth parallax: near things travel further than far things.
vec2 plateUv(sampler2D d, vec4 w, vec2 uv){
  vec2 base = w.xy + (uv - 0.5) * w.zw;
  vec2 shift = uPtr * vec2(0.020, 0.012) * (1.0 - uCalm);
  float z = texture2D(d, base).r;
  vec2 p = base + shift * (z - 0.4);
  z = texture2D(d, p).r;
  return base + shift * (z - 0.4);
}
vec3 smear(sampler2D t, vec2 p, float w){
  if (w < 0.0015) return texture2D(t, p).rgb;
  vec3 a = vec3(0.0); float tot = 0.0;
  for (int i = -8; i <= 8; i++){
    float f = float(i) / 8.0; float k = 1.0 - abs(f) * 0.55;
    a += texture2D(t, p + vec2(f * w, 0.0)).rgb * k; tot += k;
  }
  return a / tot;
}
// Horizontal streak thrown by the brightest sources, as a 2x anamorphic front element does.
float streak(sampler2D t, vec2 p, float sx){
  float a = 0.0;
  for (int i = -10; i <= 10; i++){
    float f = float(i) / 10.0;
    float l = smoothstep(0.66, 1.0, luma(texture2D(t, p + vec2(f * 0.34 * sx, 0.0)).rgb));
    a += l * l * (1.0 - abs(f));
  }
  return a / 10.0;
}
void main(){
  float f24 = floor(uTime * 24.0);
  vec2 uv = vUv;
  uv += (vec2(hash(vec2(f24, 1.3)), hash(vec2(f24, 7.7))) - 0.5) * 0.0008 * (1.0 - uCalm);
  vec2 q = uv - 0.5;
  uv = 0.5 + q * (1.0 + 0.045 * q.x * q.x);

  float t = uT;
  float e = t * t * (3.0 - 2.0 * t);
  float bell = sin(3.14159265 * t);
  float travel = 0.62 * (1.0 - uCalm);
  vec4 wA = window(uAspA, uFocA, uAgeA);
  vec4 wB = window(uAspB, uFocB, uAgeB);
  vec2 pA = plateUv(dA, wA, uv) + vec2(uDir * e * travel * wA.z, 0.0);
  vec2 pB = plateUv(dB, wB, uv) - vec2(uDir * (1.0 - e) * travel * wB.z, 0.0);
  float bw = (bell * 0.2 + (1.0 - uOpen) * 0.3) * (1.0 - uCalm);
  float m = smoothstep(0.4, 0.6, t);

  vec3 col; float st;
  if (t <= 0.0) {
    col = smear(tA, pA, bw * wA.z);
    st = streak(tA, pA, wA.z);
  } else {
    col = mix(smear(tA, pA, bw * wA.z), smear(tB, pB, bw * wB.z), m);
    st = mix(streak(tA, pA, wA.z), streak(tB, pB, wB.z), m);
  }
  float breathe = 0.86 + 0.14 * sin(uTime * 1.3) + 0.07 * (hash(vec2(f24, 3.1)) - 0.5);
  col += st * uFlare * (0.75 + 2.4 * bell + 3.0 * (1.0 - uOpen)) * breathe;
  col += uFlare * 0.12 * bell * bell;
  col = mix(vec3(0.62, 0.8, 1.0), col, smoothstep(0.0, 0.55, uOpen));

  float v = length(q * vec2(1.0, 0.8));
  col *= 1.0 - 0.45 * smoothstep(0.3, 0.92, v);

  vec2 gp = gl_FragCoord.xy / uGrain;
  float g = hash(floor(gp) + f24 * 13.7) + 0.5 * hash(floor(gp * 0.5) + f24 * 5.1) - 0.75;
  col += g * 0.09 * (1.0 - 0.6 * luma(col));
  col *= 1.0 - 0.6 * uDim;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`;

interface Plate {
  map: Texture;
  depth: Texture;
  aspect: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function mount(root: HTMLElement): () => void {
  const reel: Shot[] = [titleShot, ...projects, aboutShot];
  const calm = reducedMotion();
  const HOLD = 9; // seconds each shot holds while the reel plays

  root.innerHTML = `
  <div class="scope" data-state="loading">
    <header class="sc-top">
      <button class="sc-mark" data-go="0" aria-label="V1SU4, back to the opening shot">V1SU4</button>
      <nav class="sc-nav" aria-label="Site">
        <button data-go="1">Work</button>
        <button data-about>About</button>
        <a href="${site.contactUrl}" target="_blank" rel="noopener">Contact</a>
      </nav>
    </header>
    <main class="sc-stage">
      <div class="sc-frame">
        <canvas class="sc-gl" aria-hidden="true"></canvas>
        <div class="sc-shade"></div>
        <div class="sc-card">
          <h1 class="sc-title"></h1>
          <p class="sc-line"></p>
          <p class="sc-meta"></p>
          <div class="sc-actions">
            <button class="sc-open"></button>
            <a class="sc-ext" target="_blank" rel="noopener"></a>
          </div>
        </div>
      </div>
    </main>
    <footer class="sc-deck">
      <div class="sc-strip" role="tablist" aria-label="Shots">
        ${reel
          .map(
            (s, i) =>
              `<button role="tab" class="sc-thumb" data-go="${i}" aria-label="${esc(s.title)}" style="background-image:url('${s.thumb}');background-position:${s.focus[0] * 100}% ${s.focus[1] * 100}%"><i></i></button>`,
          )
          .join("")}
      </div>
      <div class="sc-readout">
        <button class="sc-play" aria-pressed="false"></button>
        <span class="sc-count"></span>
        <span class="sc-tc" aria-hidden="true">00:00:00:00</span>
      </div>
    </footer>
    <section class="sc-sheet" hidden aria-label="Project details">
      <button class="sc-close">Close</button>
      <div class="sc-sheet-in rd-detail"></div>
    </section>
  </div>`;

  const $ = <T extends HTMLElement>(sel: string) => root.querySelector(sel) as T;
  const el = $(".scope");
  const frame = $(".sc-frame");
  const canvas = $<HTMLCanvasElement>(".sc-gl");
  const card = $(".sc-card");
  const title = $(".sc-title");
  const line = $(".sc-line");
  const meta = $(".sc-meta");
  const open = $<HTMLButtonElement>(".sc-open");
  const ext = $<HTMLAnchorElement>(".sc-ext");
  const count = $(".sc-count");
  const tc = $(".sc-tc");
  const play = $<HTMLButtonElement>(".sc-play");
  const sheet = $(".sc-sheet");
  const sheetIn = $(".sc-sheet-in");
  const thumbs = [...root.querySelectorAll<HTMLButtonElement>(".sc-thumb")];

  // ---------- renderer ----------
  let renderer: WebGLRenderer | null = null;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  } catch {
    renderer = null;
  }
  const coarse = matchMedia("(pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75);
  const uniforms = {
    tA: { value: null as Texture | null },
    tB: { value: null as Texture | null },
    dA: { value: null as Texture | null },
    dB: { value: null as Texture | null },
    uRes: { value: new Vector2(1, 1) },
    uAspA: { value: 1.78 },
    uAspB: { value: 1.78 },
    uFocA: { value: new Vector2(0.5, 0.5) },
    uFocB: { value: new Vector2(0.5, 0.5) },
    uT: { value: 0 },
    uDir: { value: 1 },
    uPtr: { value: new Vector2(0, 0) },
    uTime: { value: 0 },
    uAgeA: { value: 0 },
    uAgeB: { value: 0 },
    uOpen: { value: calm ? 1 : 0 },
    uDim: { value: 0 },
    uCalm: { value: calm ? 1 : 0 },
    uGrain: { value: 1.6 * dpr },
    uFlare: { value: new Vector3(0.36, 0.66, 1.0) },
  };
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, depthTest: false });
  scene.add(new Mesh(new PlaneGeometry(2, 2), material));

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
  const focus = (s: Shot, v: Vector2) => v.set(s.focus[0], 1 - s.focus[1]);

  function resize() {
    const r = frame.getBoundingClientRect();
    uniforms.uRes.value.set(r.width, r.height);
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(r.width, r.height, false);
  }

  // ---------- state ----------
  let cur = 0;
  let busy = false;
  let queued: number | null = null;
  let playing = !calm;
  let held = 0; // seconds the current shot has held
  let sheetOpen = false;
  let raf = 0;
  let last = performance.now();
  let reelTime = 0;
  let trans: { start: number; dur: number; to: number; swapped: boolean } | null = null;
  let openStart = -1;
  const ptr = new Vector2(0, 0);
  let ptrSeen = 0;

  function setCard(i: number) {
    const s = reel[i];
    title.textContent = s.title;
    line.textContent = s.line;
    meta.textContent = metaLine(s);
    meta.hidden = s.kind !== "project";
    open.textContent = s.kind === "project" ? "View project" : s.kind === "about" ? "About Gordo" : "Start the reel";
    const link = s.entry?.link;
    ext.hidden = !link;
    if (link) {
      ext.href = link;
      ext.textContent = s.entry!.linkLabel ?? `Open ${new URL(link).hostname.replace(/^www\./, "")}`;
    }
    count.textContent = `${pad(i + 1)} / ${pad(reel.length)}`;
    thumbs.forEach((b, j) => {
      b.classList.toggle("is-on", j === i);
      b.setAttribute("aria-selected", String(j === i));
    });
    thumbs[i].scrollIntoView({ inline: "center", block: "nearest", behavior: calm ? "auto" : "smooth" });
  }
  function setPlay(on: boolean) {
    playing = on;
    play.textContent = on ? "Pause reel" : "Play reel";
    play.setAttribute("aria-pressed", String(on));
    el.classList.toggle("is-playing", on);
  }

  async function go(to: number, dir?: number) {
    to = (to + reel.length) % reel.length;
    if (to === cur) return;
    if (busy) {
      queued = to;
      return;
    }
    busy = true;
    const d = dir ?? (to > cur ? 1 : -1);
    card.classList.add("is-out");
    const p = await plateOf(reel[to]);
    uniforms.tB.value = p.map;
    uniforms.dB.value = p.depth;
    uniforms.uAspB.value = p.aspect;
    focus(reel[to], uniforms.uFocB.value);
    uniforms.uAgeB.value = 0;
    uniforms.uDir.value = d;
    trans = { start: performance.now(), dur: calm ? 420 : 1150, to, swapped: false };
    void plateOf(reel[(to + 1) % reel.length]);
  }

  function openSheet() {
    const s = reel[cur];
    if (s.kind === "title") {
      setPlay(true);
      void go(1, 1);
      return;
    }
    sheetIn.innerHTML = s.kind === "about" ? aboutHTML() : detailHTML(s);
    sheet.hidden = false;
    sheet.scrollTop = 0;
    requestAnimationFrame(() => el.classList.add("is-sheet"));
    sheetOpen = true;
    $(".sc-close").focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;
    el.classList.remove("is-sheet");
    window.setTimeout(() => {
      if (!sheetOpen) sheet.hidden = true;
    }, 450);
    open.focus({ preventScroll: true });
  }

  // ---------- loop ----------
  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    reelTime += dt;
    uniforms.uTime.value = reelTime;
    uniforms.uAgeA.value += dt;
    uniforms.uAgeB.value += dt;

    if (openStart >= 0) {
      const k = Math.min(1, (now - openStart) / 1700);
      uniforms.uOpen.value = 1 - Math.pow(1 - k, 3);
      if (k >= 1) openStart = -1;
    }
    uniforms.uDim.value += ((sheetOpen ? 1 : 0) - uniforms.uDim.value) * Math.min(1, dt * 6);

    // With no pointer around (touch screens), the camera drifts on its own.
    const idle = now - ptrSeen > 2500;
    const tx = idle ? Math.sin(reelTime * 0.31) * 0.7 : ptr.x;
    const ty = idle ? Math.cos(reelTime * 0.23) * 0.5 : ptr.y;
    uniforms.uPtr.value.x += (tx - uniforms.uPtr.value.x) * Math.min(1, dt * 3);
    uniforms.uPtr.value.y += (ty - uniforms.uPtr.value.y) * Math.min(1, dt * 3);

    if (trans) {
      const k = Math.min(1, (now - trans.start) / trans.dur);
      uniforms.uT.value = k;
      if (!trans.swapped && k >= 0.5) {
        trans.swapped = true;
        cur = trans.to;
        setCard(cur);
        card.classList.remove("is-out");
      }
      if (k >= 1) {
        uniforms.tA.value = uniforms.tB.value;
        uniforms.dA.value = uniforms.dB.value;
        uniforms.uAspA.value = uniforms.uAspB.value;
        uniforms.uFocA.value.copy(uniforms.uFocB.value);
        uniforms.uAgeA.value = uniforms.uAgeB.value;
        uniforms.uT.value = 0;
        trans = null;
        busy = false;
        held = 0;
        if (queued !== null) {
          const q = queued;
          queued = null;
          void go(q);
        }
      }
    } else if (playing && !sheetOpen && !document.hidden && el.dataset.state === "ready") {
      held += dt;
      if (held >= HOLD) void go(cur + 1, 1);
    }
    thumbs[cur].style.setProperty("--p", playing && !trans ? String(Math.min(1, held / HOLD)) : "0");

    const f = Math.floor(reelTime * 24);
    tc.textContent = `${pad(Math.floor(f / 86400) % 24)}:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
    renderer?.render(scene, camera);
  }

  // ---------- input ----------
  const on = <K extends keyof WindowEventMap>(k: K, fn: (e: WindowEventMap[K]) => void, opt?: AddEventListenerOptions) => {
    window.addEventListener(k, fn, opt);
    return () => window.removeEventListener(k, fn, opt);
  };
  const manual = (to: number, dir?: number) => {
    setPlay(false);
    void go(to, dir);
  };
  let wheelAcc = 0;
  let wheelAt = 0;
  const offs = [
    on("resize", resize),
    on("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = frame.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width - 0.5) * 2, -((e.clientY - r.top) / r.height - 0.5) * 2);
      ptr.x = Math.max(-1.2, Math.min(1.2, ptr.x));
      ptr.y = Math.max(-1.2, Math.min(1.2, ptr.y));
      ptrSeen = performance.now();
    }),
    on("keydown", (e) => {
      if (e.key === "Escape") return closeSheet();
      if (sheetOpen) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") manual(cur + 1, 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") manual(cur - 1, -1);
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
          manual(cur + Math.sign(wheelAcc), Math.sign(wheelAcc));
          wheelAcc = 0;
        }
      },
      { passive: true },
    ),
  ];
  let sx = 0;
  let sy = 0;
  frame.addEventListener("touchstart", (e) => ((sx = e.touches[0].clientX), (sy = e.touches[0].clientY)), { passive: true });
  frame.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) manual(cur - Math.sign(dx), -Math.sign(dx));
    },
    { passive: true },
  );
  el.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-go],[data-about],.sc-open,.sc-close,.sc-play");
    if (!t) return;
    if (t.dataset.go !== undefined) {
      closeSheet();
      manual(Number(t.dataset.go));
    } else if (t.hasAttribute("data-about")) {
      setPlay(false);
      const i = reel.length - 1;
      if (cur !== i) void go(i, 1);
      window.setTimeout(() => {
        cur === i ? openSheet() : window.setTimeout(openSheet, 700);
      }, 60);
    } else if (t.classList.contains("sc-open")) {
      if (reel[cur].kind !== "title") setPlay(false);
      openSheet();
    } else if (t.classList.contains("sc-close")) closeSheet();
    else if (t.classList.contains("sc-play")) setPlay(!playing);
  });

  // ---------- start ----------
  setCard(0);
  setPlay(playing);
  resize();
  card.classList.add("is-out");
  plateOf(reel[0])
    .then((p) => {
      uniforms.tA.value = uniforms.tB.value = p.map;
      uniforms.dA.value = uniforms.dB.value = p.depth;
      uniforms.uAspA.value = uniforms.uAspB.value = p.aspect;
      focus(reel[0], uniforms.uFocA.value);
      focus(reel[0], uniforms.uFocB.value);
      el.dataset.state = "ready";
      openStart = calm ? -1 : performance.now();
      window.setTimeout(() => card.classList.remove("is-out"), calm ? 0 : 650);
      void plateOf(reel[1]);
    })
    .catch(() => {
      // No WebGL or a failed load: show the plate as a plain image.
      frame.style.backgroundImage = `url('${reel[0].plate}')`;
      el.dataset.state = "ready";
      card.classList.remove("is-out");
    });
  if (!renderer) frame.style.backgroundImage = `url('${reel[0].plate}')`;
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    offs.forEach((off) => off());
    cache.forEach((p) => void p.then((x) => (x.map.dispose(), x.depth.dispose())).catch(() => {}));
    material.dispose();
    renderer?.dispose();
    root.innerHTML = "";
  };
}
