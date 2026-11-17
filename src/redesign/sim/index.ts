// SIM — full-frame project viewer with a quick-switch index and a see-through case-study drawer.
// Each project fills the screen (a still now, a muted teaser loop once one is listed in
// core/data.ts). Projects change on a short, low-key glitch cut borrowed from /glitch:
// row slices shear, RGB tears, then the new frame settles clean.
import {
  ClampToEdgeWrapping,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector4,
  VideoTexture,
  WebGLRenderer,
} from "three";
import "./sim.css";
import { aboutShot, esc, metaLine, projects, reducedMotion, site, type Shot } from "../core/data";
import { aboutHTML, detailHTML } from "../core/detail";

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D tA; uniform sampler2D tB;
uniform float uHasA; uniform float uHasB;
uniform vec4 uWinA; uniform vec4 uWinB;
uniform float uT; uniform float uGlitch; uniform float uTime; uniform float uIn; uniform vec2 uRes;

float rnd(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
vec3 plate(sampler2D t, float has, vec4 w, vec2 uv){
  vec2 p = clamp(w.xy + (uv - 0.5) * w.zw, 0.001, 0.999);
  return has > 0.5 ? texture2D(t, p).rgb : vec3(0.03, 0.03, 0.035);
}
vec3 frame(vec2 uv, float m){
  return mix(plate(tA, uHasA, uWinA, uv), plate(tB, uHasB, uWinB, uv), m);
}
void main(){
  float g = uGlitch;
  float t = floor(uTime * 24.0);
  vec2 uv = vUv;

  // row slices shear sideways; a few blocks jump
  float band = floor(vUv.y * mix(18.0, 46.0, rnd(vec2(t, 2.0))));
  float hit = step(1.0 - g * 0.5, rnd(vec2(band, t)));
  float slice = hit * (rnd(vec2(band, t + 7.0)) - 0.5) * 0.14 * g;
  vec2 blk = floor(vUv * vec2(9.0, 6.0));
  float b = step(1.0 - g * 0.22, rnd(blk + t * 1.7));
  uv.x += slice + b * (rnd(blk + t + 3.0) - 0.5) * 0.06 * g;

  // the cut: mostly a hard switch at the midpoint, with torn rows showing the next frame early
  float m = step(0.5, uT);
  m = mix(m, 1.0 - m, hit * step(0.15, uT) * step(uT, 0.85));

  float s = 0.004 * g + abs(slice) * 0.3;
  vec3 c = vec3(frame(uv + vec2(s, 0.0), m).r, frame(uv, m).g, frame(uv - vec2(s, 0.0), m).b);
  c *= 1.0 - 0.1 * g * step(0.5, fract(gl_FragCoord.y * 0.5));
  c += (rnd(vUv * 900.0 + uTime) - 0.5) * (0.035 + 0.08 * g);

  // soft vignette, and the opening fade
  vec2 q = vUv - 0.5;
  c *= 1.0 - 0.35 * smoothstep(0.35, 0.95, length(q * vec2(1.0, 0.85)));
  c *= uIn;
  gl_FragColor = vec4(max(c, 0.0), 1.0);
}`;

interface Plate {
  tex: Texture | null;
  aspect: number;
  video?: HTMLVideoElement;
}

export function mount(root: HTMLElement): () => void {
  const list: Shot[] = [...projects, { ...aboutShot, plate: "", depth: "", thumb: "" }];
  const ABOUT = list.length - 1;
  const calm = reducedMotion();
  const coarse = matchMedia("(pointer: coarse)").matches;

  root.innerHTML = `
  <div class="sim" data-state="loading">
    <canvas class="sm-gl" aria-hidden="true"></canvas>
    <div class="sm-shade"></div>
    <header class="sm-top">
      <span class="sm-mark">V1SU4</span>
      <nav class="sm-nav" aria-label="Site">
        <button data-go="${ABOUT}">About</button>
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
    </footer>
    <section class="sm-sheet" hidden aria-label="Project details">
      <div class="sm-sheet-bar">
        <div class="sm-step">
          <button data-step="-1" aria-label="Previous project">Prev</button>
          <span class="sm-count"></span>
          <button data-step="1" aria-label="Next project">Next</button>
        </div>
        <button class="sm-close">Close</button>
      </div>
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
  const counts = [...root.querySelectorAll<HTMLElement>(".sm-count")];
  const sheet = $(".sm-sheet");
  const sheetIn = $(".sm-sheet-in");
  const items = [...root.querySelectorAll<HTMLButtonElement>(".sm-index button")];

  // ---------- renderer ----------
  let renderer: WebGLRenderer | null = null;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  } catch {
    renderer = null;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 2 : 1.5);
  const uniforms = {
    tA: { value: null as Texture | null },
    tB: { value: null as Texture | null },
    uHasA: { value: 0 },
    uHasB: { value: 0 },
    uWinA: { value: new Vector4(0.5, 0.5, 1, 1) },
    uWinB: { value: new Vector4(0.5, 0.5, 1, 1) },
    uT: { value: 0 },
    uGlitch: { value: 0 },
    uTime: { value: 0 },
    uIn: { value: calm ? 1 : 0 },
    uRes: { value: new Vector2(1, 1) },
  };
  // windows: centre xy, size zw (the part of the plate that fills the frame)
  const winA = uniforms.uWinA.value;
  const winB = uniforms.uWinB.value;
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
    t.colorSpace = SRGBColorSpace;
    return t;
  };
  function loadVideo(src: string): Promise<Plate> {
    return new Promise((resolve, reject) => {
      const v = document.createElement("video");
      Object.assign(v, { src, muted: true, loop: true, playsInline: true, preload: "auto", crossOrigin: "anonymous" });
      v.setAttribute("playsinline", "");
      v.addEventListener("loadeddata", () => resolve({ tex: prep(new VideoTexture(v)), aspect: v.videoWidth / v.videoHeight, video: v }), { once: true });
      v.addEventListener("error", () => reject(new Error("video failed")), { once: true });
      v.load();
    });
  }
  const plateOf = (s: Shot) => {
    let p = cache.get(s.slug);
    if (!p) {
      if (!s.plate && !s.video) p = Promise.resolve({ tex: null, aspect: 16 / 9 });
      else if (s.video) p = loadVideo(s.video).catch(() => loader.loadAsync(s.plate).then((t) => ({ tex: prep(t), aspect: t.image.width / t.image.height })));
      else p = loader.loadAsync(s.plate).then((t) => ({ tex: prep(t), aspect: t.image.width / t.image.height }));
      cache.set(s.slug, p);
    }
    return p;
  };
  // Cover fit around the plate's focus point, with a little overscan for the slow push-in.
  function setWindow(w: Vector4, s: Shot, asp: number) {
    const fr = uniforms.uRes.value.x / uniforms.uRes.value.y;
    const k = 0.97;
    const sx = (fr > asp ? 1 : fr / asp) * k;
    const sy = (fr > asp ? asp / fr : 1) * k;
    w.set(Math.min(1 - sx / 2, Math.max(sx / 2, s.focus[0])), Math.min(1 - sy / 2, Math.max(sy / 2, 1 - s.focus[1])), sx, sy);
  }

  function resize() {
    const r = el.getBoundingClientRect();
    uniforms.uRes.value.set(r.width, r.height);
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(r.width, r.height, false);
    if (cur >= 0) setWindow(winA, list[cur], aspA);
    setWindow(winB, list[next], aspB);
  }

  // ---------- state ----------
  let cur = -1;
  let next = 0;
  let aspA = 1.78;
  let aspB = 1.78;
  let busy = false;
  let queued: number | null = null;
  let sheetOpen = false;
  let raf = 0;
  let last = performance.now();
  let time = 0;
  let trans: { start: number; dur: number; to: number; swapped: boolean } | null = null;
  let burst = 0;
  let inStart = -1;
  let playing: HTMLVideoElement | undefined;

  function setCard(i: number) {
    const s = list[i];
    title.textContent = s.kind === "about" ? "About" : s.title;
    line.textContent = s.line;
    meta.textContent = metaLine(s);
    meta.hidden = s.kind !== "project";
    open.textContent = s.kind === "about" ? "Read more" : "View project";
    const link = s.entry?.link;
    ext.hidden = !link;
    if (link) {
      ext.href = link;
      ext.textContent = s.entry!.linkLabel ?? `Open ${new URL(link).hostname.replace(/^www\./, "")}`;
    }
    counts.forEach((c) => (c.textContent = `${i + 1} of ${list.length}`));
    items.forEach((b, j) => b.toggleAttribute("aria-current", j === i));
  }
  function fillSheet(i: number) {
    const s = list[i];
    sheetIn.innerHTML = s.kind === "about" ? aboutHTML() : detailHTML(s);
    sheet.scrollTop = 0;
  }

  async function go(to: number) {
    to = (to + list.length) % list.length;
    if (to === cur) {
      if (to === ABOUT && !sheetOpen) openSheet();
      return;
    }
    if (busy) {
      queued = to;
      return;
    }
    busy = true;
    next = to;
    card.classList.add("is-out");
    const p = await plateOf(list[to]);
    aspB = p.aspect;
    uniforms.tB.value = p.tex;
    uniforms.uHasB.value = p.tex ? 1 : 0;
    setWindow(winB, list[to], aspB);
    if (p.video) {
      videos.set(to, p.video);
      p.video.play().catch(() => {});
    }
    trans = { start: performance.now(), dur: calm ? 1 : 520, to, swapped: false };
    void plateOf(list[(to + 1) % list.length]);
  }

  function openSheet() {
    fillSheet(cur);
    sheet.hidden = false;
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

  // ---------- loop ----------
  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    time += dt;
    uniforms.uTime.value = time;
    if (inStart >= 0) {
      const k = Math.min(1, (now - inStart) / 900);
      uniforms.uIn.value = k;
      if (k >= 1) inStart = -1;
    }

    if (trans) {
      const k = Math.min(1, (now - trans.start) / trans.dur);
      uniforms.uT.value = k;
      // a short spike around the cut, then clean
      burst = calm ? 0 : Math.max(0, 1 - Math.abs(k - 0.5) * 2.2) * 0.75;
      if (!trans.swapped && k >= 0.5) {
        trans.swapped = true;
        cur = trans.to;
        setCard(cur);
        if (sheetOpen) fillSheet(cur);
        else if (cur === ABOUT) openSheet();
        card.classList.remove("is-out");
      }
      if (k >= 1) {
        if (playing && playing !== cacheVideo(cur)) playing.pause();
        playing = cacheVideo(cur);
        uniforms.tA.value = uniforms.tB.value;
        uniforms.uHasA.value = uniforms.uHasB.value;
        winA.copy(winB);
        aspA = aspB;
        uniforms.uT.value = 0;
        trans = null;
        busy = false;
        burst = 0;
        if (queued !== null) {
          const q = queued;
          queued = null;
          void go(q);
        }
      }
    }
    uniforms.uGlitch.value = burst;
    renderer?.render(scene, camera);
  }
  const videos = new Map<number, HTMLVideoElement>();
  function cacheVideo(i: number) {
    return videos.get(i);
  }

  // ---------- input ----------
  const on = <K extends keyof WindowEventMap>(k: K, fn: (e: WindowEventMap[K]) => void, opt?: AddEventListenerOptions) => {
    window.addEventListener(k, fn, opt);
    return () => window.removeEventListener(k, fn, opt);
  };
  let wheelAcc = 0;
  let wheelAt = 0;
  const offs = [
    on("resize", resize),
    on("keydown", (e) => {
      if (e.key === "Escape") return closeSheet();
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || (!sheetOpen && e.key === "ArrowDown")) void go(cur + 1);
      else if (e.key === "ArrowLeft" || (!sheetOpen && e.key === "ArrowUp")) void go(cur - 1);
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
          void go(cur + Math.sign(wheelAcc));
          wheelAcc = 0;
        }
      },
      { passive: true },
    ),
  ];
  let sx = 0;
  let sy = 0;
  canvas.addEventListener("touchstart", (e) => ((sx = e.touches[0].clientX), (sy = e.touches[0].clientY)), { passive: true });
  canvas.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) void go(cur - Math.sign(dx));
    },
    { passive: true },
  );
  el.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-go],[data-step],.sm-open,.sm-close");
    if (!t) return;
    if (t.dataset.go !== undefined) void go(Number(t.dataset.go));
    else if (t.dataset.step) void go(cur + Number(t.dataset.step));
    else if (t.classList.contains("sm-open")) openSheet();
    else if (t.classList.contains("sm-close")) closeSheet();
  });

  // ---------- start ----------
  resize();
  card.classList.add("is-out");
  plateOf(list[0])
    .then((p) => {
      aspA = aspB = p.aspect;
      uniforms.tA.value = uniforms.tB.value = p.tex;
      uniforms.uHasA.value = uniforms.uHasB.value = p.tex ? 1 : 0;
      cur = 0;
      setWindow(winA, list[0], aspA);
      winB.copy(winA);
      if (p.video) {
        videos.set(0, p.video);
        playing = p.video;
        p.video.play().catch(() => {});
      }
      setCard(0);
      el.dataset.state = "ready";
      inStart = calm ? -1 : performance.now();
      window.setTimeout(() => card.classList.remove("is-out"), calm ? 0 : 350);
      void plateOf(list[1]);
    })
    .catch(() => {
      cur = 0;
      setCard(0);
      el.dataset.state = "ready";
      el.style.backgroundImage = `url('${list[0].plate}')`;
      card.classList.remove("is-out");
    });
  // remember which video belongs to which project once it loads
  list.forEach((s, i) => {
    if (s.video) void plateOf(s).then((p) => p.video && videos.set(i, p.video));
  });
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    offs.forEach((off) => off());
    cache.forEach((p) =>
      void p
        .then((x) => {
          x.tex?.dispose();
          x.video?.pause();
        })
        .catch(() => {}),
    );
    material.dispose();
    renderer?.dispose();
    root.innerHTML = "";
  };
}
