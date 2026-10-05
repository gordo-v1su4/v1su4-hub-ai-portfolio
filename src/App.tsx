import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { projects, labItems, skillGroups, site, type Project } from "./data/projects";
import { gsap } from "./hooks/gsap";

type Route = { view: "home" | "lab" | "about" | "project"; slug?: string };
function parseHash(): Route {
  const h = window.location.hash.replace(/^#/, "") || "/";
  if (h.startsWith("/lab")) return { view: "lab" };
  if (h.startsWith("/about")) return { view: "about" };
  const m = h.match(/^\/work\/([\w-]+)/);
  if (m) return { view: "project", slug: m[1] };
  return { view: "home" };
}

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const COL = "mx-auto w-full max-w-[520px] px-4";

/* In-site navigation. Each move adds a history entry, so the browser's back button and [BACK] both work. */
let inSiteMoves = 0;
function go(path: string, _e?: unknown) {
  inSiteMoves += 1;
  window.location.hash = path;
  window.scrollTo(0, 0);
}
function back() {
  if (inSiteMoves > 0) { inSiteMoves -= 1; window.history.back(); }
  else { window.location.hash = "/"; window.scrollTo(0, 0); }
}

function Header({ onMenu, showBack }: { onMenu: () => void; showBack: boolean }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/25 backdrop-blur-xl backdrop-saturate-150">
      <div className={`${COL} flex items-center justify-between py-4`}>
        <button onClick={() => go("/")} className="select-none leading-none" aria-label={`${site.name}, home`}>
          <span className="font-display text-[1.9rem] font-semibold uppercase leading-none tracking-[-0.03em] text-accent">{site.name}</span>
        </button>
        <div className="flex items-center gap-4 font-mono text-[13px] font-medium tracking-[0.06em] text-accent">
          {showBack && <button onClick={back}>[BACK]</button>}
          <button onClick={onMenu}>[MENU]</button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return <div className="h-16" aria-hidden="true" />;
}

/* Simple centered menu first; WORK opens the project list inside the menu, with a way back. */
function Menu({ open, onClose, onContact }: { open: boolean; onClose: () => void; onContact: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState<"main" | "work">("main");
  useEffect(() => { if (open) setLevel("main"); }, [open]);
  useEffect(() => {
    if (!open || !ref.current || reduceMotion()) return;
    gsap.fromTo(".menu-link", { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power3.out" });
  }, [open, level]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (level === "work") setLevel("main"); else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, level]);
  if (!open) return null;
  const nav = (p: string) => () => { onClose(); go(p); };
  const big = "menu-link font-mono text-[22px] tracking-[0.22em] text-accent hover:opacity-70";
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" className="no-scrollbar fixed inset-0 z-[80] overflow-y-auto bg-ink/95 backdrop-blur-sm">
      <div className={`${COL} flex justify-end gap-4 py-4 font-mono text-[13px] font-medium tracking-[0.06em]`}>
        {level === "work" && <button onClick={() => setLevel("main")}>[BACK]</button>}
        <button onClick={onClose}>[CLOSE]</button>
      </div>
      {level === "main" ? (
        <nav className="flex min-h-[70svh] flex-col items-center justify-center gap-6">
          <button onClick={() => setLevel("work")} className={big}>WORK</button>
          <button onClick={nav("/lab")} className={big}>LAB</button>
          <button onClick={nav("/about")} className={big}>ABOUT</button>
          <button onClick={() => { onClose(); onContact(); }} className={big}>CONTACT</button>
        </nav>
      ) : (
        <nav className="flex min-h-[70svh] flex-col items-center justify-center gap-4 px-4 text-center">
          {projects.map((p) => (
            <button key={p.slug} onClick={nav(`/work/${p.slug}`)} className="menu-link font-mono text-[14px] font-semibold uppercase tracking-[0.04em] text-accent hover:opacity-70">
              {p.title} <span className="font-medium opacity-80">‘{p.type}’</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

function Caption({ name, sub, align = "center", size = "sm" }: { name: string; sub: string; align?: "center" | "left"; size?: "sm" | "lg" }) {
  return (
    <p className={`mt-3 font-mono font-semibold uppercase tracking-[0.03em] text-accent ${align === "center" ? "text-center" : ""} ${size === "lg" ? "text-[15px]" : "text-[13px]"}`}>
      {name} <span>‘{sub}’</span>
    </p>
  );
}

/* Rounded still with slow scroll parallax on the image inside. */
function Still({ src, on, className = "still aspect-[4/3]" }: { src: string; on?: boolean; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!box.current || !img.current || reduceMotion()) return;
    const t = gsap.fromTo(img.current, { yPercent: -7 }, {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: box.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return (
    <div ref={box} className={`relative overflow-hidden ${className}`}>
      <img ref={img} src={src} alt="" loading="lazy" className={`still-img absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover ${on ? "is-on" : ""}`} />
    </div>
  );
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion()) return;
    const t = gsap.fromTo(el, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return ref;
}

function Card({ p }: { p: Project }) {
  const ref = useReveal<HTMLButtonElement>();
  return (
    <button ref={ref} onClick={(e) => go(`/work/${p.slug}`, e)} className="group block w-full text-left" aria-label={`${p.title}, ${p.type}`}>
      <Still src={p.cover} />
      <Caption name={p.title} sub={p.type} />
    </button>
  );
}

function HomePage() {
  return (
    <div className={`${COL} flex flex-col gap-10 pt-2`}>
      {projects.map((p) => <Card key={p.slug} p={p} />)}
    </div>
  );
}

function CreditLines({ rows }: { rows: [string, string][] }) {
  return (
    <div className="font-mono text-[11.5px] uppercase leading-[1.55] tracking-[0.01em]">
      {rows.map(([k, v]) => (
        <p key={k}><span className="font-medium text-accent/55">{k}:</span> <span className="font-bold text-accent">{v}</span></p>
      ))}
    </div>
  );
}

/*
  Looping momentum carousel (greymac-style).
  Wheel, drag, flick, trackpad, or arrow keys add velocity; friction bleeds it off so it glides and slows.
  The slides repeat three times and the position wraps, so it never runs out. Speed tilts the cards in 3D,
  and each card's image slides against it (parallax). While the pointer is over the carousel the wheel
  drives it; move the pointer off it (above or below) to scroll the page.
*/
type Slide = { kicker: string; title: string; sub: string; img: string; pos: string };

function slidesFor(p: Project): Slide[] {
  const covers = [p.cover, ...projects.filter((x) => x.slug !== p.slug).map((x) => x.cover)];
  const steps: Slide[] = p.flow.map((s, i) => ({
    kicker: `${String(i + 1).padStart(2, "0")} / ${String(p.flow.length).padStart(2, "0")}`,
    title: s.label, sub: s.sub, img: p.cover, pos: `${(i * 25) % 100}% 50%`,
  }));
  // Sample slides so the loop has enough cards; replace with real media later.
  const samples: Slide[] = Array.from({ length: Math.max(0, 8 - steps.length) }, (_, i) => ({
    kicker: "Sample", title: `Media ${String(i + 1).padStart(2, "0")}`, sub: "Placeholder",
    img: covers[(i + 1) % covers.length], pos: "50% 50%",
  }));
  return [...steps, ...samples];
}

function HorizontalSteps({ p }: { p: Project }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const base = slidesFor(p);
  const looped = [...base, ...base, ...base];

  useEffect(() => {
    const w = wrap.current, t = track.current;
    if (!w || !t) return;
    const cards = Array.from(t.children) as HTMLElement[];
    const imgs = cards.map((c) => c.querySelector("img"));
    const still = reduceMotion();
    const n = cards.length / 3;

    let pos = 0, vel = 0, raf = 0;
    let drag: { x: number; pos: number; lastX: number; lastT: number; v: number } | null = null;
    const FRICTION = 0.955;  // closer to 1 = longer glide
    const WHEEL_GAIN = 0.05; // speed added per wheel step
    const IMG_SCALE = 1.45;  // image is larger than its card so it has room to travel

    const centerOf = (c: HTMLElement) => c.offsetLeft + c.offsetWidth / 2 - w.clientWidth / 2;
    const setWidth = () => (cards[n]?.offsetLeft ?? 0) - (cards[0]?.offsetLeft ?? 0);
    // Keep the position inside the middle copy; jumping by exactly one set width is invisible.
    const wrapPos = () => {
      const sw = setWidth();
      if (sw <= 0 || !cards[n]) return;
      const a = centerOf(cards[n]);
      while (pos < a) { pos += sw; if (drag) drag.pos += sw; }
      while (pos >= a + sw) { pos -= sw; if (drag) drag.pos -= sw; }
    };

    const tick = () => {
      if (!drag) {
        pos += vel;
        vel *= FRICTION;
        if (Math.abs(vel) < 0.01) vel = 0;
      }
      wrapPos();
      t.style.transform = `translate3d(${-pos}px,0,0)`;
      const tilt = still ? 0 : Math.max(-22, Math.min(22, vel * -1.1));
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${tilt}deg)`;
        const img = imgs[i];
        if (img && !still) {
          const dist = c.offsetLeft + c.offsetWidth / 2 - pos - w.clientWidth / 2;
          // Parallax across the whole trip: the image sits at one edge as the card enters on the right,
          // slides evenly while the card crosses, and reaches the other edge as the card leaves on the left.
          const room = ((IMG_SCALE - 1) * c.offsetWidth) / 2;
          const trip = w.clientWidth / 2 + c.offsetWidth / 2;
          const shift = -room * Math.max(-1, Math.min(1, dist / trip));
          img.style.transform = `translate3d(${shift}px,0,0) scale(${IMG_SCALE})`;
        }
      });
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      const mid = cards[n + Math.floor((n - 1) / 2)];
      if (mid) { pos = centerOf(mid); vel = 0; }
    };
    start();
    requestAnimationFrame(start); // again after fonts and layout settle
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!d) return;
      e.preventDefault();
      if (still) { pos += d; return; }
      vel += d * WHEEL_GAIN;
    };
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, pos, lastX: e.clientX, lastT: performance.now(), v: 0 };
      vel = 0;
      setDragging(true);
      try { w.setPointerCapture(e.pointerId); } catch { /* pointer already released */ }
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const now = performance.now();
      const dx = e.clientX - drag.lastX;
      const dt = Math.max(1, now - drag.lastT);
      drag.v = drag.v * 0.6 + (-dx / dt) * 16 * 0.4; // px per frame, smoothed
      drag.lastX = e.clientX;
      drag.lastT = now;
      pos = drag.pos - (e.clientX - drag.x);
      vel = drag.v; // keeps the tilt live while dragging
    };
    const onUp = () => {
      if (!drag) return;
      vel = still ? 0 : drag.v; // a flick keeps gliding
      drag = null;
      setDragging(false);
    };
    const onKey = (e: KeyboardEvent) => {
      const step = (cards[1]?.offsetLeft ?? 0) - (cards[0]?.offsetLeft ?? 0);
      if (e.key === "ArrowRight") { vel += step * 0.045; e.preventDefault(); }
      if (e.key === "ArrowLeft") { vel -= step * 0.045; e.preventDefault(); }
    };

    w.addEventListener("wheel", onWheel, { passive: false });
    w.addEventListener("pointerdown", onDown);
    w.addEventListener("pointermove", onMove);
    w.addEventListener("pointerup", onUp);
    w.addEventListener("pointercancel", onUp);
    w.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      w.removeEventListener("wheel", onWheel);
      w.removeEventListener("pointerdown", onDown);
      w.removeEventListener("pointermove", onMove);
      w.removeEventListener("pointerup", onUp);
      w.removeEventListener("pointercancel", onUp);
      w.removeEventListener("keydown", onKey);
    };
  }, [p.slug]);

  return (
    <section className="py-10">
      <h2 className="mx-auto mb-4 w-full max-w-[640px] px-4 font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">How it works</h2>
      <div
        ref={wrap}
        tabIndex={0}
        aria-label="How it works slides. Drag, scroll, or use the arrow keys."
        className={`overflow-hidden py-6 [perspective:1400px] [touch-action:pan-y] ${dragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
      >
        <div ref={track} className="flex gap-5 will-change-transform">
          {looped.map((s, i) => (
            <div key={i} aria-hidden={i < base.length || i >= base.length * 2} className="still relative flex aspect-video w-[78vw] max-w-[520px] shrink-0 flex-col justify-end p-5 will-change-transform">
              <img src={s.img} alt="" draggable={false} className="still-img pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45" style={{ objectPosition: s.pos }} />
              <div className="relative font-mono uppercase">
                <p className="text-[11px] font-medium text-accent/60">{s.kicker}</p>
                <p className="mt-1 text-[14px] font-bold">{s.title}</p>
                <p className="mt-1 text-[11px] font-medium text-accent/75">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className={`${COL} mt-1 text-center font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent/50`}>Drag or scroll · move off the slides to scroll the page</p>
    </section>
  );
}

function ProjectPage({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug) ?? projects[0];
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const hero = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hero.current || reduceMotion()) return;
    gsap.fromTo(hero.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out", delay: 0.15 });
  }, [slug]);

  const WIDE = "mx-auto w-full max-w-[1200px] px-4 md:px-8";
  // Real media when added in data; otherwise two empty slots (one above the carousel, one below).
  const media: (string | undefined)[] = p.media?.length ? p.media : [undefined, undefined];
  return (
    <>
      {/* Full-bleed hero, then a small centered title block (milledollars-style case study). */}
      <Still src={p.cover} on className="h-[72svh] w-full md:h-[92svh]" />
      <div ref={hero} className="mx-auto w-full max-w-[640px] px-4">
        <p className="pt-12 text-center font-mono text-[15px] font-bold uppercase tracking-[0.03em]">
          {p.title} <span>‘{p.type}’</span>
        </p>

        <p className="mt-10 font-mono text-[14px] font-bold uppercase leading-[1.45] tracking-[0.02em]">{p.tagline}</p>
        <p className="mt-4 font-mono text-[12px] font-medium uppercase leading-[1.6] text-accent/70">{p.what}</p>

        <h2 className="mt-10 font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">Credits</h2>
        <div className="mt-3">
          <CreditLines rows={[
            ["Role", p.role],
            ["Stack", p.stack.join(", ")],
            ["Status", p.status],
            ["Year", p.year],
          ]} />
        </div>
        <p className="mt-6 font-mono text-[13px] font-semibold uppercase tracking-[0.03em]">
          {p.link
            ? <a href={p.link} target="_blank" rel="noopener" className="hover:opacity-70">[Open app ↗]</a>
            : <span className="text-accent/60">[{p.status}]</span>}
        </p>
      </div>

      {/* One centered image or video between the text and the carousel. */}
      <div className={`${WIDE} mt-16`}>
        <div className="mx-auto w-full max-w-[900px]">
          {media[0] ? <Still src={media[0]} /> : <MediaSlot n={1} />}
        </div>
      </div>

      {p.horizontal ? (
        <div className="mt-12"><HorizontalSteps p={p} /></div>
      ) : (
        <div className="mx-auto mt-16 w-full max-w-[640px] px-4">
          <h2 className="font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">How it works</h2>
          <div className="mt-3">
            <CreditLines rows={p.flow.map((s, i) => [`${String(i + 1).padStart(2, "0")} ${s.label}`, s.sub])} />
          </div>
        </div>
      )}

      {/* The rest of the media, stacked and centered. */}
      <div className={`${WIDE} mt-12 flex flex-col items-center gap-12`}>
        {media.slice(1).map((src, i) => (
          <div key={i} className="w-full max-w-[900px]">
            {src ? <Still src={src} /> : <MediaSlot n={i + 2} />}
          </div>
        ))}
      </div>

      <div className={`${COL} mt-24`}>
        <button onClick={() => go(`/work/${next.slug}`)} className="group block w-full text-left">
          <Still src={next.cover} />
          <Caption name={next.title} sub="Next" />
        </button>
      </div>
    </>
  );
}

function MediaSlot({ n }: { n: number }) {
  return (
    <div className="flex aspect-[16/10] items-center justify-center rounded-[0.85rem] border border-dashed border-accent/30 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent/45">
      Media {String(n).padStart(2, "0")} · add a screenshot or clip
    </div>
  );
}

function LabPage() {
  return (
    <div className={`${COL} pt-2`}>
      <Caption name="Lab" sub="In development" align="left" size="lg" />
      {labItems.map((l) => (
        <div key={l.slug} className="mt-10">
          <h2 className="font-mono text-[14px] font-bold uppercase tracking-[0.03em]">{l.title} <span>‘{l.kind}’</span></h2>
          <p className="mt-2 font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/70">{l.body}</p>
          <p className="mt-2 font-mono text-[11.5px] uppercase"><span className="font-medium text-accent/55">Status:</span> <span className="font-bold">{l.status}</span></p>
        </div>
      ))}
    </div>
  );
}

function AboutPage() {
  return (
    <div className={`${COL} pt-2`}>
      <Caption name={site.name} sub={site.role} align="left" size="lg" />
      <p className="mt-6 font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/75">
        I build custom AI production tools around ComfyUI, choosing the right image, video, audio and music models for each project and connecting them in one pipeline. Before AI, I spent 12+ years as an FX artist at ILM, DNEG, Sony Imageworks, MPC and Luma Pictures.
      </p>
      <h2 className="mt-10 font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">Credits</h2>
      <div className="mt-3">
        <CreditLines rows={[
          ["Role", site.role],
          ["Focus", site.focus],
          ["Base", site.base],
          ["Studio", site.label],
          ...skillGroups.map((g): [string, string] => [g.title, g.items.join(", ")]),
        ]} />
      </div>
    </div>
  );
}

function Contact({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;
  const copy = async () => {
    if (!site.email) return;
    try { await navigator.clipboard.writeText(site.email); setCopied(true); } catch { /* address stays visible to select */ }
  };
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 md:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Contact" onClick={(e) => e.stopPropagation()} className="w-full max-w-[520px] rounded-t-2xl bg-ink p-6 text-accent md:rounded-2xl">
        <div className="mb-5 flex items-center justify-between font-mono text-[13px] font-semibold uppercase">
          <span>Contact</span>
          <button onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {site.email ? (
          <>
            <p className="select-all text-center font-mono text-[14px] font-bold">{site.email}</p>
            <button onClick={copy} className="mt-4 w-full bg-accent py-3 font-mono text-[12px] font-bold uppercase tracking-[0.06em] text-ink">{copied ? "Copied" : "Copy email"}</button>
          </>
        ) : (
          <p className="text-center font-mono text-[12px] font-medium uppercase opacity-80">Email coming soon. Reach me on LinkedIn for now.</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);


  const key = route.view + (route.slug ?? "");
  return (
    <div className="min-h-svh bg-ink text-accent">
      <Header onMenu={() => setMenu(true)} showBack={route.view !== "home"} />
      <main key={key} className={route.view === "project" ? "" : "pt-[68px]"}>
        {route.view === "home" && <HomePage />}
        {route.view === "lab" && <LabPage />}
        {route.view === "about" && <AboutPage />}
        {route.view === "project" && <ProjectPage slug={route.slug ?? projects[0].slug} />}
      </main>
      <Footer />
      <Menu open={menu} onClose={() => setMenu(false)} onContact={() => setContact(true)} />
      <Contact open={contact} onClose={() => setContact(false)} />
    </div>
  );
}
