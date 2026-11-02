import gsap from "gsap";
import * as THREE from "three";
import "./alternate1.css";
import { site, skillGroups, softwareGroups } from "../data/projects";
import { lab, work, type Entry } from "../variations/editorial/data";

// ---------- data ----------
const projects: Entry[] = [...work, ...lab];
const N = projects.length;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = (n: number) => String(n + 1).padStart(2, "0");
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s/&-])(\w)/g, (_, a: string, b: string) => a + b.toUpperCase());
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const kind = (p: Entry) => titleCase(p.category);
const stripImage = (p: Entry) => p.previewImage ?? p.image;

if (matchMedia("(hover: none)").matches) $("hint").textContent = "Swipe · Tap to open";

const glitchAbout = {
  tagline: "Creative technologist and visual artist.",
  lead: "I like creative problem solving—and building tools that help an idea become visible, testable, and real.",
  context:
    "VFX roots across film and television (ILM, DNEG, MPC, The Mill). Now: AI film, immersive experiences, and apps that carry work from first sketch to finished delivery—often with Houdini still in the loop.",
};

// ---------- split buttons ----------
const seg = (k: string, label: string, ar: string, attrs = "", tag = "a") =>
  `<${tag} ${attrs}><span class="k">${k}</span><span class="t">${esc(label)}</span><span class="ar">${ar}</span></${tag}>`;
const ext = (href: string) => `href="${href}" target="_blank" rel="noopener"`;
const appSeg = (p: Entry, k: string) => p.link
  ? seg(k, p.linkLabel ?? "Open app", "↗", ext(p.link))
  : seg(k, p.experimental ? "Lab only" : "Private build", "·", `class="off" aria-disabled="true"`, "span");

// Hovering a half scrambles its label through glitch characters before it settles.
// pointerenter (captured) fires once per entry, so the label's own text swaps can't retrigger it.
const SCRAMBLE = "▓▒░/\\_<>#*";
document.addEventListener("pointerenter", (e) => {
  const a = e.target;
  if (reduced || !(a instanceof Element) || !a.matches(".split > :not(.off)")) return;
  const t = a.querySelector<HTMLElement & { _raf?: number }>(".t");
  if (!t) return;
  const text = t.dataset.text ?? (t.dataset.text = t.textContent ?? "");
  let f = 0;
  cancelAnimationFrame(t._raf ?? 0);
  const step = () => {
    t.textContent = [...text].map((c, j) => (c === " " || j < f / 2 ? c : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0])).join("");
    if (++f / 2 <= text.length) t._raf = requestAnimationFrame(step);
    else t.textContent = text;
  };
  step();
}, true);

// ---------- WebGL strip ----------
const canvas = $<HTMLCanvasElement>("gl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x09090b, 1);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
const PW = 1.6, PH = 1.0, GAP = 1.95;
const shared = { uTime: { value: 0 } };

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }`;
// Glitch: row slices shear sideways, blocks jump, RGB channels tear, scanlines and grain flicker.
// uGlitch 0 = a clean image; everything scales with it.
const frag = /* glsl */ `
  uniform sampler2D uTex; uniform vec2 uPlane; uniform vec2 uImg; uniform float uTime;
  uniform float uColor; uniform float uOpacity; uniform float uReady; uniform float uGlitch;
  varying vec2 vUv;
  float rnd(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 ratio = vec2(
      min((uPlane.x / uPlane.y) / (uImg.x / uImg.y), 1.0),
      min((uPlane.y / uPlane.x) / (uImg.y / uImg.x), 1.0));
    vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);

    float g = uGlitch;
    float t = floor(uTime * 20.0);
    float band = floor(vUv.y * mix(14.0, 40.0, rnd(vec2(t, 2.0))));
    float hit = step(1.0 - g * 0.55, rnd(vec2(band, t)));
    float slice = hit * (rnd(vec2(band, t + 7.0)) - 0.5) * 0.22 * g;
    vec2 blk = floor(vUv * vec2(8.0, 5.0));
    float b = step(1.0 - g * 0.3, rnd(blk + t * 1.7));
    uv.x += slice + b * (rnd(blk + t + 3.0) - 0.5) * 0.1 * g;
    uv.y += b * (rnd(blk + t + 9.0) - 0.5) * 0.03 * g;
    uv = clamp(uv, 0.001, 0.999);

    float s = 0.006 * g + abs(slice) * 0.35;
    vec3 c = vec3(texture2D(uTex, uv + vec2(s, 0.0)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(s, 0.0)).b);
    c *= 1.0 - 0.12 * g * step(0.5, fract(vUv.y * uPlane.y * 120.0));
    c += (rnd(vUv * 900.0 + uTime) - 0.5) * 0.1 * g;
    c = mix(c, vec3(1.0), hit * b * g * 0.5);

    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(mix(vec3(lum), c, 0.35) * 0.5, c, uColor);
    col = mix(vec3(0.067, 0.067, 0.078), col, uReady);
    gl_FragColor = vec4(col, uOpacity);
  }`;

type Uniforms = {
  uTime: { value: number }; uTex: { value: THREE.Texture | null }; uPlane: { value: THREE.Vector2 }; uImg: { value: THREE.Vector2 };
  uColor: { value: number }; uOpacity: { value: number }; uReady: { value: number }; uGlitch: { value: number };
};
type Card = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> & { u: Uniforms; burst: { v: number } };

const loader = new THREE.TextureLoader();
const geo = new THREE.PlaneGeometry(PW, PH, 1, 1);
const meshes: Card[] = projects.map((p, i) => {
  const u: Uniforms = {
    ...shared,
    uTex: { value: null }, uPlane: { value: new THREE.Vector2(PW, PH) }, uImg: { value: new THREE.Vector2(16, 10) },
    uColor: { value: 0 }, uOpacity: { value: 1 }, uReady: { value: 0 }, uGlitch: { value: 0 },
  };
  const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: u, vertexShader: vert, fragmentShader: frag, transparent: true })) as unknown as Card;
  m.u = u;
  m.burst = { v: 0 };
  m.userData.i = i;
  loader.load(stripImage(p), (t) => {
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    u.uTex.value = t;
    const img = t.image as HTMLImageElement;
    u.uImg.value.set(img.width, img.height);
    gsap.to(u.uReady, { value: 1, duration: reduced ? 0 : 0.8 });
    glitch(i, 0.9, 0.6);
  });
  scene.add(m);
  return m;
});

type Mode = "index" | "opening" | "detail" | "closing" | "about";
let mode: Mode = "index";
let target = 0, current = 0, vel = 0, active = -1, hovered = -1;

// A short glitch burst on one image: jumps to `amount`, then decays to clean.
function glitch(i: number, amount = 1, dur = 0.45) {
  if (reduced) return;
  const b = meshes[i].burst;
  gsap.killTweensOf(b);
  gsap.fromTo(b, { v: Math.max(b.v, amount) }, { v: 0, duration: dur, ease: "steps(6)" });
}
// Now and then the centred image twitches on its own.
(function idle() {
  setTimeout(() => {
    if (mode === "index" && active >= 0) glitch(active, 0.5 + Math.random() * 0.4, 0.25);
    idle();
  }, 2500 + Math.random() * 3500);
})();

let viewH = 1, viewW = 1, yOff = 0;
const narrow = () => innerWidth / innerHeight < 0.8;
function resize() {
  const w = innerWidth, h = innerHeight, aspect = w / h;
  renderer.setSize(w, h, false);
  camera.aspect = aspect;
  const frac = narrow() ? 0.8 : 0.36; // plane width as a share of the screen
  viewW = PW / frac;
  viewH = viewW / aspect;
  camera.position.z = viewH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  camera.updateProjectionMatrix();
  yOff = viewH * (narrow() ? 0.16 : 0.15); // lift the strip clear of the title
}
addEventListener("resize", resize);
resize();

// ---------- scroll, drag, hover ----------
let snapT = 0;
let drag: { x: number; t: number; moved: number } | null = null;
const clamp = (v: number) => Math.max(0, Math.min(N - 1, v));
const snap = () => {
  clearTimeout(snapT);
  snapT = window.setTimeout(() => { if (!drag) target = Math.round(target); }, 140);
};

addEventListener("wheel", (e) => {
  if (mode !== "index") return;
  target = clamp(target + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.0035);
  snap();
}, { passive: true });

const pointer = new THREE.Vector2(), ray = new THREE.Raycaster(), parallax = { x: 0, y: 0 };
function pick(e: PointerEvent) {
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(pointer, camera);
  const hit = ray.intersectObjects(meshes)[0];
  return hit ? (hit.object.userData.i as number) : -1;
}
canvas.addEventListener("pointerdown", (e) => {
  if (mode !== "index") return;
  drag = { x: e.clientX, t: target, moved: 0 };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  parallax.x = e.clientX / innerWidth - 0.5;
  parallax.y = e.clientY / innerHeight - 0.5;
  if (mode !== "index") return;
  if (drag) {
    const dx = e.clientX - drag.x;
    drag.moved = Math.max(drag.moved, Math.abs(dx));
    target = clamp(drag.t - ((dx * (viewW / innerWidth)) / GAP) * 1.4);
  }
  const h = pick(e);
  if (h !== hovered && h >= 0 && !drag) glitch(h, 0.7, 0.35);
  hovered = h;
  canvas.style.cursor = drag && drag.moved > 5 ? "grabbing" : hovered >= 0 ? "pointer" : "grab";
});
canvas.addEventListener("pointerup", (e) => {
  if (!drag) return;
  const wasClick = drag.moved < 6;
  drag = null;
  snap();
  if (!wasClick) return;
  const i = pick(e);
  if (i < 0) return;
  if (i === Math.round(current)) go(projects[i].slug);
  else target = i;
});
canvas.addEventListener("pointerleave", () => { hovered = -1; });
addEventListener("keydown", (e) => {
  if (mode === "index") {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") target = clamp(Math.round(target) + 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") target = clamp(Math.round(target) - 1);
    if (e.key === "Enter" && document.activeElement === document.body) go(projects[Math.round(current)].slug);
  } else if ((mode === "detail" || mode === "about") && e.key === "Escape") back();
});

// ---------- caption + list ----------
const list = $("list");
list.innerHTML = projects.map((p, i) => (i > 0 && p.experimental && !projects[i - 1].experimental ? '<span class="sep" aria-hidden="true"></span>' : "") +
  `<button data-i="${i}">${esc(titleCase(p.title))}</button>`).join("");
list.addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>("button");
  if (b) target = Number(b.dataset.i);
});

function caption(i: number) {
  const p = projects[i];
  const els = ["count", "title", "line", "meta", "now-split"].map((id) => $(id));
  const fill = () => {
    $("count").textContent = `${pad(i)} / ${pad(N - 1)}${p.experimental ? " · Lab" : ""}`;
    $("title").textContent = titleCase(p.title);
    $("line").textContent = p.line;
    const statusMeta = p.statusNote
      ? `<span class="meta-status"><span>${esc(p.status)}</span><span class="meta-status-note">${esc(p.statusNote)}</span></span>`
      : `<span>${esc(p.status)}</span>`;
    $("meta").innerHTML = `<span>${p.year}</span><span>${esc(kind(p))}</span>${statusMeta}`;
    $("now-split").innerHTML = seg("01", "View project", "→", `href="#/${p.slug}"`) + appSeg(p, "02");
  };
  list.querySelectorAll<HTMLButtonElement>("button").forEach((b) => b.classList.toggle("on", Number(b.dataset.i) === i));
  if (active !== -1) glitch(i, 1, 0.5);
  if (reduced || active === -1) { fill(); return; }
  gsap.killTweensOf(els);
  gsap.to(els, {
    y: -12, opacity: 0, duration: 0.16, stagger: 0.02, ease: "power2.in", onComplete: () => {
      fill();
      gsap.fromTo(els, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power3.out" });
    },
  });
}

// ---------- pages ----------
const section = (label: string, html: string) => `<section class="sec reveal"><span class="label">${label}</span>${html}</section>`;

function renderDetail(i: number) {
  const p = projects[i], n = projects[(i + 1) % N];
  $("d-count").textContent = `${pad(i)} / ${pad(N - 1)}`;
  const img = $<HTMLImageElement>("d-img");
  img.src = p.image;
  img.alt = titleCase(p.title);
  img.style.objectFit = p.imageFit === "contain" ? "contain" : "cover";

  const statusFact = p.statusNote ? `${p.status} · ${p.statusNote}` : p.status;
  const facts: [string, string][] = [["Year", p.year], ["Role", p.role], ["Status", statusFact], ["Type", kind(p)]];
  const flow = p.flow.length
    ? section("How it works", `<div class="flow" style="--n:${Math.min(p.flow.length, 5)}">${p.flow.map((f, k) =>
        `<div><span class="label">${pad(k)}</span><strong>${esc(f.label)}</strong><p>${esc(f.sub)}</p></div>`).join("")}</div>`)
    : "";
  const worlds = p.worlds?.length
    ? section("Worlds", `<div class="worlds">${p.worlds.map((w, k) =>
        `<div><span class="label">${pad(k)}</span><h4 class="display">${esc(w.title)}</h4><p>${esc(w.description)}</p></div>`).join("")}</div>`)
    : "";
  const groups = p.stackGroups?.length ? p.stackGroups : [{ title: "Stack", items: p.stack }];
  const stack = section("Built with", `<div class="groups">${groups.map((g) =>
    `<div><h4 class="label">${esc(g.title)}</h4><ul>${g.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></div>`).join("")}</div>`);
  const gallery = p.media.length
    ? section("Work", `<div class="gallery">${p.media.map((src) =>
        `<figure><img src="${src}" alt="${esc(titleCase(p.title))} screen" loading="lazy" decoding="async"></figure>`).join("")}</div>`)
    : "";

  $("d-body").innerHTML = `
    <div class="reveal">
      <span class="label">${p.experimental ? "Lab experiment" : "Project"} · ${esc(kind(p))}</span>
      <h2 class="display">${esc(titleCase(p.title))}</h2>
      <p class="tag">${esc(p.line)}</p>
      <div class="actions"><div class="split">${appSeg(p, "01")}${seg("02", p.media.length ? "See the work" : "How it works", "↓", `href="#" data-jump`)}</div></div>
    </div>
    <dl class="facts label reveal">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    ${section("Overview", `<div class="cols"><p class="lead">${esc(p.summary)}</p><p class="quote">“${esc(p.rationale)}”</p></div>`)}
    ${worlds}${flow}${stack}${gallery}
    <a class="next reveal" href="#/${n.slug}"><span><span class="label">Next</span><br><span class="display">${esc(titleCase(n.title))}</span></span><span class="label">→</span></a>`;

  const jump = $("d-body").querySelector<HTMLAnchorElement>("[data-jump]");
  if (jump) jump.onclick = (e) => {
    e.preventDefault();
    const to = $("d-body").querySelector<HTMLElement>(".sec:last-of-type") ?? $("d-body");
    $("detail").scrollTo({ top: to.offsetTop + $("d-body").offsetTop - 140, behavior: reduced ? "auto" : "smooth" });
  };
  observe($("detail"));
}

function renderAbout() {
  const archives = site.links.filter((l) => /IMDB|VFX REEL/.test(l.label));
  const reel = archives.find((l) => l.label === "VFX REEL")?.href ?? site.contactUrl;
  $("a-body").innerHTML = `
    <div class="about-intro reveal">
      <p class="about-eyebrow label">${esc(site.base)} · ${esc(site.label)}</p>
      <h2 class="display about-name">${esc(site.name)}</h2>
      <p class="about-tagline">${esc(glitchAbout.tagline)}</p>
      <p class="about-lead">${esc(glitchAbout.lead)}</p>
      <div class="actions"><div class="split">${seg("01", "Get in touch", "↗", ext(site.contactUrl))}${seg("02", "VFX reel", "↗", ext(reel))}</div></div>
    </div>
    <div class="about-strip reveal">
      <div class="about-strip-item"><span class="label">Role</span><p>${esc(site.role)}</p></div>
      <div class="about-strip-item"><span class="label">Focus</span><p>${esc(site.focus)}</p></div>
      <div class="about-strip-item"><span class="label">Base</span><p>${esc(site.base)}</p></div>
    </div>
    <section class="about-panel reveal">
      <span class="label">Background</span>
      <p class="about-panel-copy">${esc(glitchAbout.context)}</p>
    </section>
    <section class="sec reveal">
      <span class="label">What I do</span>
      <div class="about-pillars">${skillGroups.map((g, k) =>
        `<article class="about-pillar"><span class="about-pillar-idx label">${pad(k)}</span><h3 class="display">${esc(g.title)}</h3><p>${esc(g.items[0])}</p></article>`).join("")}</div>
    </section>
    <section class="about-tools reveal">
      <span class="label">Tools &amp; stacks</span>
      <div class="about-tool-cloud">${softwareGroups.flatMap((g) => g.items.slice(0, 4)).map((it) => `<span>${esc(it)}</span>`).join("")}</div>
    </section>
    <section class="about-archives reveal">
      <span class="label">Film &amp; TV archives</span>
      <p>${esc(site.archives)}</p>
      <div class="about-link-row">${archives.map((l) => `<a class="label" ${ext(l.href)}>${esc(l.label)} ↗</a>`).join("")}</div>
    </section>
    <section class="contact reveal" id="contact">
      <span class="label">Contact</span>
      <h3 class="display contact-title">${esc(site.contactHeading)}</h3>
      <p class="contact-copy">${esc(site.contactBody)}</p>
      <div class="split">${seg("01", "LinkedIn", "↗", ext(site.contactUrl))}${seg("02", "Instagram", "↗", ext(site.links.find((l) => l.label === "INSTAGRAM")?.href ?? site.contactUrl))}</div>
    </section>`;
  observe($("about"));
}

// Fade sections up as they scroll into view inside a page.
let io: IntersectionObserver | null = null;
function observe(root: HTMLElement) {
  io?.disconnect();
  io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io?.unobserve(e.target); }
  }), { root, rootMargin: "0px 0px -8% 0px" });
  root.querySelectorAll(".reveal").forEach((el) => io!.observe(el));
}

function showPage(el: HTMLElement, from = 0) {
  el.scrollTop = from;
  document.body.classList.add("paged");
  el.setAttribute("aria-hidden", "false");
  gsap.set(el, { visibility: "visible" });
  gsap.to(el, { opacity: 1, duration: reduced ? 0 : 0.3 });
  el.querySelector<HTMLElement>("[data-back]")?.focus({ preventScroll: true });
}
function hidePage(el: HTMLElement, dur = 0.25) {
  document.body.classList.remove("paged");
  el.setAttribute("aria-hidden", "true");
  return new Promise<void>((done) => gsap.to(el, {
    opacity: 0, duration: reduced ? 0 : dur, onComplete: () => { gsap.set(el, { visibility: "hidden" }); done(); },
  }));
}

// Put the strip back to rest (used when a page swaps without the zoom-out).
function resetStrip() {
  openTl?.kill();
  openTl = null;
  meshes.forEach((m) => { m.scale.set(1, 1, 1); m.position.y = yOff; m.u.uOpacity.value = 1; });
  gsap.set("#ui", { opacity: 1 });
}

// ---------- zoom in / out ----------
let openTl: gsap.core.Timeline | null = null;
function zoomIn(i: number) {
  mode = "opening";
  target = current = i;
  hovered = -1;
  renderDetail(i);
  const m = meshes[i], heroFrac = narrow() ? 0.56 : 0.78;
  const sx = viewW / PW, sy = (viewH * heroFrac) / PH;
  const y = viewH / 2 - (viewH * heroFrac) / 2;
  const d = reduced ? 0 : 1;
  openTl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => { mode = "detail"; showPage($("detail")); settle(); } })
    .to("#ui", { opacity: 0, duration: 0.3 * d, ease: "power2.out" }, 0)
    .to(meshes.filter((o) => o !== m).map((o) => o.u.uOpacity), { value: 0, duration: 0.4 * d }, 0)
    .to(m.u.uColor, { value: 1, duration: 0.4 * d }, 0)
    .add(() => glitch(i, 1, 0.9), 0)
    .to(m.scale, { x: sx, y: sy, duration: 0.9 * d }, 0.1 * d)
    .to(m.position, { y, duration: 0.9 * d }, 0.1 * d)
    .to(camera.position, { x: 0, y: 0, duration: 0.9 * d }, 0);
}
async function zoomOut() {
  mode = "closing";
  await hidePage($("detail"));
  if (!openTl) { mode = "index"; settle(); return; }
  openTl.eventCallback("onComplete", null);
  openTl.eventCallback("onReverseComplete", () => { openTl = null; mode = "index"; settle(); });
  openTl.timeScale(1.4).reverse();
}

// ---------- routing: #/ · #/<slug> · #/about · #/about/contact ----------
function go(hash: string) {
  const h = hash.startsWith("#") ? hash : `#/${hash}`;
  if (location.hash !== h) location.hash = h;
}
// "← Index" and Escape always land on the index; the browser's back button still walks history.
const back = () => go("#/");
document.querySelectorAll<HTMLElement>("[data-back]").forEach((b) => (b.onclick = back));
document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#/"]');
  if (!a) return;
  e.preventDefault();
  go(a.getAttribute("href")!);
});

function parse() {
  const h = location.hash.replace(/^#\/?/, "");
  if (h === "about" || h === "about/contact") return { view: "about" as const, contact: h === "about/contact" };
  const i = projects.findIndex((p) => p.slug === h);
  return i >= 0 ? { view: "project" as const, i } : { view: "index" as const };
}
function setNav(view: string, contact = false) {
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((a) =>
    a.classList.toggle("on", a.dataset.nav === (contact ? "contact" : view === "project" ? "index" : view)));
}

let busy = false;
async function route() {
  // Mid-zoom: settle() calls back in once the animation lands.
  if (busy || mode === "opening" || mode === "closing") return;
  const r = parse();
  setNav(r.view, r.view === "about" && r.contact);
  if (r.view === "project" && mode === "detail" && active === r.i) return; // already there
  if (r.view === "index" && mode === "index") return;
  busy = true;
  const handled = location.hash;
  if (r.view === "project") {
    if (mode === "detail") {
      // Swap straight to another project's page; the strip resets underneath.
      await hidePage($("detail"), 0.15);
      resetStrip();
      mode = "index";
    }
    if (mode === "about") { await hidePage($("about")); resetStrip(); mode = "index"; }
    if (mode === "index") zoomIn(r.i);
  } else if (r.view === "about") {
    if (mode === "detail") { await hidePage($("detail"), 0.15); resetStrip(); }
    if (mode !== "about") {
      renderAbout();
      gsap.to("#ui", { opacity: 0, duration: reduced ? 0 : 0.25 });
      showPage($("about"));
      mode = "about";
    }
    if (r.contact) {
      const c = $("contact");
      $("about").scrollTo({ top: c.offsetTop - 140, behavior: reduced ? "auto" : "smooth" });
    } else $("about").scrollTo({ top: 0 });
  } else {
    if (mode === "detail") await zoomOut();
    else if (mode === "about") { await hidePage($("about")); gsap.to("#ui", { opacity: 1, duration: reduced ? 0 : 0.3 }); mode = "index"; }
  }
  busy = false;
  // The link may have changed while this transition ran; catch up with it.
  if (location.hash !== handled) route();
}
// Animations can make a route wait; once one settles, catch up with the latest hash.
function settle() { busy = false; route(); }
addEventListener("hashchange", () => route());

// ---------- loop ----------
const clock = new THREE.Clock();
function tick() {
  shared.uTime.value = clock.getElapsedTime();
  if (mode === "index") {
    const prev = current;
    current += (target - current) * (reduced ? 1 : 0.085);
    vel += (current - prev - vel) * 0.2;
    camera.position.x += (parallax.x * 0.25 - camera.position.x) * 0.05;
    camera.position.y += (-parallax.y * 0.15 - camera.position.y) * 0.05;
  } else {
    vel *= 0.85;
  }
  const a = Math.round(clamp(current));
  if (a !== active) { caption(a); active = a; }
  meshes.forEach((m, i) => {
    if (mode === "index") {
      m.position.x = (i - current) * GAP;
      m.position.y = yOff;
      const want = i === a || i === hovered ? 1 : 0;
      m.u.uColor.value += (want - m.u.uColor.value) * 0.08;
    } else if (i === a) {
      m.position.x = 0;
    }
    // Motion glitches everything a little; bursts add on top.
    const speed = reduced ? 0 : Math.min(0.6, Math.abs(vel) * 10);
    m.u.uGlitch.value = Math.min(1, speed + m.burst.v);
    m.u.uPlane.value.set(PW * m.scale.x, PH * m.scale.y);
  });
  camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

// A deep link (#/pindeck, #/about) opens straight to that page.
if (parse().view !== "index") {
  const r = parse();
  if (r.view === "project") target = current = r.i;
  setTimeout(route, 250);
} else setNav("index");
