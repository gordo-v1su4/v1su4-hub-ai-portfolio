<script lang="ts">
  /*
    Looping momentum carousel (greymac-style).
    Wheel, drag, flick, trackpad, or arrow keys add velocity; friction bleeds it off so it glides and slows.
    The slides repeat three times and the position wraps, so it never runs out. Cards stay flat.
    While the pointer is over the carousel the wheel drives it; move off it (above or below) to scroll the page.
  */
  import { onMount } from "svelte";
  import { portfolioProjects, type Project } from "../data/projects";

  const projects = portfolioProjects();
  import { COL, reduceMotion } from "./router.svelte";

  type Slide = { kicker: string; title: string; sub: string; img: string; pos: string };
  let { p }: { p: Project } = $props();

  function slidesFor(p: Project): Slide[] {
    const covers = [p.cover, ...projects.filter((x) => x.slug !== p.slug).map((x) => x.cover)];
    const imgs = [p.cover, ...(p.media ?? [])];
    const steps: Slide[] = p.flow.map((s, i) => ({
      kicker: `${String(i + 1).padStart(2, "0")} / ${String(p.flow.length).padStart(2, "0")}`,
      title: s.label, sub: s.sub, img: imgs[i % imgs.length] ?? p.cover, pos: `${(i * 25) % 100}% 50%`,
    }));
    // Sample slides so the loop has enough cards; replace with real media later.
    const samples: Slide[] = Array.from({ length: Math.max(0, 8 - steps.length) }, (_, i) => ({
      kicker: "Sample", title: `Media ${String(i + 1).padStart(2, "0")}`, sub: "Placeholder",
      img: covers[(i + 1) % covers.length], pos: "50% 50%",
    }));
    return [...steps, ...samples];
  }

  const base = $derived(slidesFor(p));
  const looped = $derived([...base, ...base, ...base]);

  let wrap: HTMLDivElement;
  let track: HTMLDivElement;
  let dragging = $state(false);

  onMount(() => {
    const w = wrap, t = track;
    const cards = Array.from(t.children) as HTMLElement[];
    const still = reduceMotion();
    const n = cards.length / 3;

    let pos = 0, vel = 0, raf = 0;
    let drag: { x: number; pos: number; lastX: number; lastT: number; v: number } | null = null;
    const FRICTION = 0.955;  // closer to 1 = longer glide
    const WHEEL_GAIN = 0.05; // speed added per wheel step

    // Measure once (and on resize) instead of every frame; per-frame layout reads cause stutter.
    let lefts: number[] = [], widths: number[] = [], viewW = 0;
    const measure = () => {
      lefts = cards.map((c) => c.offsetLeft);
      widths = cards.map((c) => c.offsetWidth);
      viewW = w.clientWidth;
    };
    const centerAt = (i: number) => lefts[i] + widths[i] / 2 - viewW / 2;
    const setWidth = () => (lefts[n] ?? 0) - (lefts[0] ?? 0);
    // Keep the position inside the middle copy; jumping by exactly one set width is invisible.
    const wrapPos = () => {
      const sw = setWidth();
      if (sw <= 0 || lefts[n] == null) return;
      const a = centerAt(n);
      while (pos < a) { pos += sw; if (drag) drag.pos += sw; }
      while (pos >= a + sw) { pos -= sw; if (drag) drag.pos -= sw; }
    };

    const frame = () => {
      if (!drag) {
        pos += vel;
        vel *= FRICTION;
        if (Math.abs(vel) < 0.01) vel = 0;
      }
      wrapPos();
      t.style.transform = `translate3d(${-pos}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      measure();
      const mid = n + Math.floor((n - 1) / 2);
      if (lefts[mid] != null) { pos = centerAt(mid); vel = 0; }
    };
    start();
    requestAnimationFrame(start); // again after fonts and layout settle
    const ro = new ResizeObserver(() => {
      // Keep the same card centered across a resize.
      const before = setWidth();
      const frac = before > 0 ? (pos - centerAt(n)) / before : 0;
      measure();
      pos = centerAt(n) + frac * setWidth();
    });
    ro.observe(w);
    raf = requestAnimationFrame(frame);

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
      dragging = true;
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
    };
    const onUp = () => {
      if (!drag) return;
      vel = still ? 0 : drag.v; // a flick keeps gliding
      drag = null;
      dragging = false;
    };
    const onKey = (e: KeyboardEvent) => {
      const step = (lefts[1] ?? 0) - (lefts[0] ?? 0);
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
      ro.disconnect();
      w.removeEventListener("wheel", onWheel);
      w.removeEventListener("pointerdown", onDown);
      w.removeEventListener("pointermove", onMove);
      w.removeEventListener("pointerup", onUp);
      w.removeEventListener("pointercancel", onUp);
      w.removeEventListener("keydown", onKey);
    };
  });
</script>

<section class="py-10">
  <h2 class="mx-auto mb-4 w-full max-w-[640px] px-4 font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">How it works</h2>
  <!-- Focusable so the arrow keys can move the slides. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    bind:this={wrap}
    tabindex="0"
    role="region"
    aria-label="How it works slides. Drag, scroll, or use the arrow keys."
    class="overflow-hidden py-6 [touch-action:pan-y] {dragging ? 'cursor-grabbing select-none' : 'cursor-grab'}"
  >
    <div bind:this={track} class="flex gap-5 will-change-transform">
      {#each looped as s, i (i)}
        <div aria-hidden={i < base.length || i >= base.length * 2} class="still relative flex aspect-video w-[78vw] max-w-[520px] shrink-0 flex-col justify-end p-5">
          <img src={s.img} alt="" draggable="false" class="still-img pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45" style="object-position: {s.pos}" />
          <div class="relative font-mono uppercase">
            <p class="text-[11px] font-medium text-accent/60">{s.kicker}</p>
            <p class="mt-1 text-[14px] font-bold">{s.title}</p>
            <p class="mt-1 text-[11px] font-medium text-accent/75">{s.sub}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <p class="{COL} mt-1 text-center font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent/50">Drag or scroll · move off the slides to scroll the page</p>
</section>
