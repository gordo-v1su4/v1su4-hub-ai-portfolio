import { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { projects, labItems, skillGroups, site, type Project } from "./data/projects";
import { gsap, ScrollTrigger } from "./hooks/gsap";

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

/* Page transition: an orange circle grows from the click point, the route changes underneath, then it fades. */
let wipeEl: HTMLDivElement | null = null;
function go(path: string, e?: { clientX: number; clientY: number; detail?: number }) {
  const set = () => { window.location.hash = path; window.scrollTo(0, 0); };
  if (!wipeEl || reduceMotion()) return set();
  const fromPointer = e && e.detail !== 0;
  const x = fromPointer ? e!.clientX : window.innerWidth / 2;
  const y = fromPointer ? e!.clientY : window.innerHeight / 2;
  const el = wipeEl;
  gsap.killTweensOf(el);
  gsap.set(el, { display: "block", opacity: 1, clipPath: `circle(0px at ${x}px ${y}px)` });
  gsap.to(el, {
    clipPath: `circle(150vmax at ${x}px ${y}px)`, duration: 0.55, ease: "power3.in",
    onComplete: () => {
      set();
      gsap.to(el, { opacity: 0, duration: 0.45, delay: 0.08, ease: "power2.out", onComplete: () => { gsap.set(el, { display: "none" }); } });
    },
  });
}

function Wipe() {
  return <div ref={(n) => { wipeEl = n; }} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden bg-accent" />;
}

function Wordmark() {
  return (
    <button onClick={(e) => go("/", e)} className="group flex items-baseline gap-3 select-none text-left leading-none" aria-label={`${site.name}, home`}>
      <span className="font-display text-[1.55rem] font-semibold uppercase tracking-[-0.02em] text-accent md:text-[2.1rem]">Gordo</span>
      <span className="hidden font-mono text-[10px] tracking-[0.3em] text-accent/60 sm:inline">{site.label}</span>
    </button>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <Wordmark />
        <button onClick={onMenu} className="font-mono text-[12px] tracking-[0.18em] text-accent">[MENU]</button>
      </div>
    </header>
  );
}

function Footer({ onContact }: { onContact: () => void }) {
  return (
    <footer className="mt-24 border-t border-accent/20">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-display text-[1.2rem] font-semibold uppercase tracking-[-0.02em]">Gordo</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent/60">{site.name} · {site.label} · {site.base}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.16em]">
          {site.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener" className="text-accent/75 hover:text-accent">{l.label}</a>
          ))}
          <button onClick={onContact} className="text-accent/75 hover:text-accent">CONTACT</button>
        </nav>
      </div>
    </footer>
  );
}

function Menu({ open, onClose, onContact }: { open: boolean; onClose: () => void; onContact: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || !ref.current || reduceMotion()) return;
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(".menu-link", { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power3.out" });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const nav = (p: string) => (e: React.MouseEvent) => { onClose(); go(p, e); };
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 backdrop-blur-sm">
      <button onClick={onClose} className="absolute right-5 top-5 font-mono text-[12px] tracking-[0.18em] text-accent md:right-8">[CLOSE]</button>
      <nav className="flex flex-col items-center gap-5">
        <button onClick={nav("/")} className="menu-link font-mono text-[22px] tracking-[0.22em] text-accent">WORK</button>
        <button onClick={nav("/lab")} className="menu-link font-mono text-[22px] tracking-[0.22em] text-accent">LAB</button>
        <button onClick={nav("/about")} className="menu-link font-mono text-[22px] tracking-[0.22em] text-accent">ABOUT</button>
        <button onClick={() => { onClose(); onContact(); }} className="menu-link font-mono text-[22px] tracking-[0.22em] text-accent">CONTACT</button>
      </nav>
    </div>
  );
}

function Caption({ name, sub, align = "center" }: { name: string; sub: string; align?: "center" | "left" }) {
  return (
    <p className={`mt-3 font-mono text-[12px] uppercase tracking-[0.04em] text-accent ${align === "center" ? "text-center" : ""}`}>
      {name} <span className="opacity-90">‘{sub}’</span>
    </p>
  );
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion()) return;
    const t = gsap.fromTo(el, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return ref;
}

/* Home card: tap the still to flip it; the back has the description and links. */
function FlipCard({ p }: { p: Project }) {
  const wrap = useReveal<HTMLDivElement>();
  const inner = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const flip = (to: boolean) => {
    setFlipped(to);
    if (reduceMotion()) gsap.set(inner.current, { rotateY: to ? 180 : 0 });
    else gsap.to(inner.current, { rotateY: to ? 180 : 0, duration: 0.75, ease: "power3.inOut" });
  };
  return (
    <div ref={wrap}>
      <div className="[perspective:1600px]">
        <div ref={inner} className="relative aspect-[16/10.5] [transform-style:preserve-3d]">
          <button
            onClick={() => flip(true)}
            inert={flipped}
            aria-label={`${p.title}: show details`}
            className="face still group absolute inset-0 block w-full text-left"
          >
            <img src={p.cover} alt="" loading="lazy" className="still-img h-full w-full object-cover" />
            <span className="dot absolute inset-0 m-auto h-11 w-11 rounded-full bg-accent" />
            {p.status !== "Live" && (
              <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-accent">{p.status.toUpperCase()}</span>
            )}
          </button>
          <div inert={!flipped} className="face still absolute inset-0 flex flex-col justify-between bg-[#181818] p-5 [transform:rotateY(180deg)] md:p-6">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-accent">{p.tagline}</p>
              <p className="mt-3 line-clamp-4 font-mono text-[11px] leading-relaxed text-accent/70 md:line-clamp-5">{p.what}</p>
            </div>
            <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.16em]">
              <button onClick={() => flip(false)} className="text-accent/60 hover:text-accent">[BACK]</button>
              <div className="flex gap-4">
                <button onClick={(e) => go(`/work/${p.slug}`, e)} className="text-accent hover:underline">PROJECT →</button>
                {p.link && <a href={p.link} target="_blank" rel="noopener" className="text-accent hover:underline">OPEN ↗</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Caption name={p.title} sub={p.type} />
    </div>
  );
}

function HomePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pt-4 md:px-8">
      <p className="mb-10 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-accent/70">
        Creative technologist <span className="opacity-90">‘generative AI for commercials, TV &amp; live shows’</span>
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
        {projects.map((p) => <FlipCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}

function CreditLines({ rows }: { rows: [string, string][] }) {
  return (
    <div className="font-mono text-[11.5px] uppercase leading-[1.7] text-accent">
      {rows.map(([k, v]) => (
        <p key={k}><span className="text-accent/50">{k}:</span> {v}</p>
      ))}
    </div>
  );
}

/* Pinned section that scrolls sideways through a project's steps, then releases back to vertical scroll. */
function HorizontalSteps({ p }: { p: Project }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [native] = useState(reduceMotion);
  useEffect(() => {
    if (native || !section.current || !track.current) return;
    const s = section.current, t = track.current;
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
      gsap.to(t, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: s, pin: true, scrub: 0.8, start: "top top", end: () => `+=${dist()}`, invalidateOnRefresh: true },
      });
    }, s);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => { window.removeEventListener("load", refresh); ctx.revert(); };
  }, [native, p.slug]);
  return (
    <section ref={section} className={`relative flex flex-col justify-center py-10 ${native ? "" : "h-svh overflow-hidden"}`}>
      <div className="mx-auto mb-6 w-full max-w-[1100px] px-5 font-mono text-[13px] tracking-[0.12em] md:px-8">HOW IT WORKS →</div>
      <div ref={track} className={`flex w-max gap-5 px-5 md:gap-8 md:px-8 ${native ? "max-w-full snap-x overflow-x-auto" : ""}`}>
        {p.flow.map((s, i) => (
          <div key={s.label} className="still relative flex aspect-[4/5] w-[72vw] shrink-0 snap-start flex-col justify-end p-5 sm:w-[46vw] md:w-[30vw] lg:w-[24vw]">
            <img src={p.cover} alt="" className="still-img absolute inset-0 h-full w-full object-cover opacity-40" style={{ objectPosition: `${(i * 25) % 100}% 50%` }} />
            <div className="relative">
              <p className="font-display text-[2.4rem] font-semibold leading-none">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 font-mono text-[13px] tracking-[0.1em]">{s.label}</p>
              <p className="mt-1 font-mono text-[11px] text-accent/75">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
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
    gsap.fromTo(hero.current.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.15 });
  }, [slug]);

  return (
    <>
      <div ref={hero} className="mx-auto max-w-[760px] px-5 pt-2 md:px-8">
        <div className="still relative aspect-[16/10.5]">
          <img src={p.cover} alt="" className="still-img is-on h-full w-full object-cover" />
          <span className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-accent" />
        </div>
        <Caption name={p.title} sub={p.type} align="left" />
        <p className="mt-6 max-w-[60ch] font-mono text-[13px] leading-relaxed">{p.tagline}</p>
        <p className="mt-3 max-w-[60ch] font-mono text-[12px] leading-relaxed text-accent/75">{p.what}</p>

        <h2 className="mt-12 font-mono text-[15px] tracking-[0.08em]">CREDITS</h2>
        <div className="mt-4">
          <CreditLines rows={[
            ["Type", p.type],
            ["Role", p.role],
            ["Status", p.status],
            ["Year", p.year],
            ["Stack", p.stack.join(", ")],
          ]} />
        </div>
      </div>

      {p.horizontal ? (
        <div className="mt-12"><HorizontalSteps p={p} /></div>
      ) : (
        <div className="mx-auto mt-12 max-w-[760px] px-5 md:px-8">
          <h2 className="font-mono text-[15px] tracking-[0.08em]">HOW IT WORKS</h2>
          <div className="mt-4">
            <CreditLines rows={p.flow.map((s, i) => [`${String(i + 1).padStart(2, "0")} ${s.label}`, s.sub])} />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[760px] px-5 md:px-8">
        {p.link ? (
          <a href={p.link} target="_blank" rel="noopener" className="mt-12 flex w-full items-center justify-center gap-2 border border-accent py-3 font-mono text-[12px] tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-ink">
            OPEN APP <ArrowUpRight size={14} />
          </a>
        ) : (
          <p className="mt-12 border border-accent/30 py-3 text-center font-mono text-[12px] tracking-[0.2em] text-accent/70">{p.status.toUpperCase()}</p>
        )}

        <button onClick={(e) => go(`/work/${next.slug}`, e)} className="group mt-16 block w-full text-left">
          <div className="still relative aspect-[16/10.5]">
            <img src={next.cover} alt="" loading="lazy" className="still-img h-full w-full object-cover" />
            <span className="dot absolute inset-0 m-auto h-11 w-11 rounded-full bg-accent" />
          </div>
          <Caption name={next.title} sub="Next" />
        </button>
      </div>
    </>
  );
}

function LabPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-[760px] px-5 pt-4 md:px-8">
      <p className="mb-10 text-center font-mono text-[12px] tracking-[0.16em]">LAB <span className="opacity-80">‘IN DEVELOPMENT’</span></p>
      {labItems.map((l) => (
        <div key={l.slug} className="mb-6 border-b border-accent/20 pb-6">
          <button onClick={() => setOpen(open === l.slug ? null : l.slug)} aria-expanded={open === l.slug} className="block w-full">
            <Caption name={l.title} sub={l.kind} />
          </button>
          {open === l.slug && (
            <div className="mx-auto mt-3 max-w-[60ch] text-center font-mono text-[12px] leading-relaxed text-accent/80">
              <p>{l.body}</p>
              <p className="mt-2 uppercase tracking-[0.12em] opacity-90">{l.status}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 pt-4 md:px-8">
      <Caption name={site.name} sub={site.role} align="left" />
      <p className="mt-6 max-w-[60ch] font-mono text-[12.5px] leading-relaxed text-accent/85">
        I build custom AI production tools around ComfyUI, choosing the right image, video, audio and music models for each project and connecting them in one pipeline. Before AI, I spent 12+ years as an FX artist at ILM, DNEG, Sony Imageworks, MPC and Luma Pictures.
      </p>
      <h2 className="mt-12 font-mono text-[15px] tracking-[0.08em]">CREDITS</h2>
      <div className="mt-4">
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
      <div role="dialog" aria-modal="true" aria-label="Contact" onClick={(e) => e.stopPropagation()} className="w-full max-w-[430px] rounded-t-2xl bg-ink p-6 text-accent md:rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <span className="font-mono text-[12px] tracking-[0.2em]">CONTACT</span>
          <button onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {site.email ? (
          <>
            <p className="select-all text-center font-mono text-[14px]">{site.email}</p>
            <button onClick={copy} className="mt-4 w-full bg-accent py-3 font-mono text-[12px] tracking-[0.18em] text-ink">{copied ? "COPIED" : "COPY EMAIL"}</button>
          </>
        ) : (
          <p className="text-center font-mono text-[12px] opacity-80">Email coming soon. Reach me on LinkedIn for now.</p>
        )}
        <div className="mt-5 flex justify-center gap-6">
          {site.links.slice(0, 3).map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener" className="font-mono text-[11px] tracking-[0.16em] text-accent/80">{l.label}</a>
          ))}
        </div>
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

  useEffect(() => {
    const base = `${site.name} · ${site.label}`;
    document.title =
      route.view === "project" ? `${projects.find((p) => p.slug === route.slug)?.title ?? "Work"} · ${base}`
      : route.view === "lab" ? `Lab · ${base}`
      : route.view === "about" ? `About · ${base}`
      : `${base} · Creative Technologist`;
  }, [route]);

  const key = route.view + (route.slug ?? "");
  return (
    <div className="min-h-svh bg-ink text-accent">
      <Header onMenu={() => setMenu(true)} />
      <main key={key}>
        {route.view === "home" && <HomePage />}
        {route.view === "lab" && <LabPage />}
        {route.view === "about" && <AboutPage />}
        {route.view === "project" && <ProjectPage slug={route.slug ?? projects[0].slug} />}
      </main>
      <Footer onContact={() => setContact(true)} />
      <Menu open={menu} onClose={() => setMenu(false)} onContact={() => setContact(true)} />
      <Contact open={contact} onClose={() => setContact(false)} />
      <Wipe />
    </div>
  );
}
