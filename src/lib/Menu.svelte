<script lang="ts">
  /*
    Simple centered menu first. WORK, LAB and ABOUT each open inside the menu (same entrance, same [BACK]),
    so moving between them feels the same. CONTACT opens the contact panel.
  */
  import { tick } from "svelte";
  import { labItems, portfolioProjects, site, skillGroups } from "../data/projects";

  const projects = portfolioProjects();
  import { gsap } from "./gsap";
  import { COL, go, reduceMotion } from "./router.svelte";

  let { open, onclose, oncontact }: { open: boolean; onclose: () => void; oncontact: () => void } = $props();
  type Level = "main" | "work" | "lab" | "about";
  let level = $state<Level>("main");
  let openLab = $state<string | null>(null);
  let openWork = $state<string | null>(null);

  $effect(() => { if (open) { level = "main"; openLab = null; openWork = null; } });
  $effect(() => {
    if (!open || reduceMotion()) return;
    void level;
    tick().then(() => {
      gsap.fromTo(".menu-link", { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power3.out" });
    });
  });

  let accordionTween: ReturnType<typeof gsap.to> | undefined;
  $effect(() => {
    void open;
    void level;
    return () => accordionTween?.kill();
  });

  function toggleDescription(event: MouseEvent, section: "work" | "lab", slug: string) {
    const button = event.currentTarget as HTMLButtonElement;
    const list = button.closest<HTMLElement>("[data-accordion]");
    if (!list) return;
    accordionTween?.kill();
    const panels = Array.from(list.querySelectorAll<HTMLElement>("[data-description]"));
    const current = section === "work" ? openWork : openLab;
    const next = current === slug ? null : slug;
    if (section === "work") openWork = next; else openLab = next;

    accordionTween = gsap.to(panels, {
      height: (_index, panel: HTMLElement) => panel.dataset.description === next ? panel.scrollHeight : 0,
      opacity: (_index, panel: HTMLElement) => panel.dataset.description === next ? 1 : 0,
      duration: reduceMotion() ? 0 : 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        const expanded = panels.find(panel => panel.dataset.description === next);
        if (expanded) gsap.set(expanded, { height: "auto" });
      },
    });
  }

  function onkeydown(e: KeyboardEvent) {
    if (!open || e.key !== "Escape") return;
    if (level !== "main") level = "main"; else onclose();
  }
  const nav = (p: string) => () => { onclose(); go(p); };
  const big = "menu-link font-mono text-[22px] tracking-[0.22em] text-accent hover:opacity-70";
  const item = "menu-link font-mono text-[14px] font-semibold uppercase tracking-[0.04em] text-accent";
  const aboutRows: [string, string][] = [
    ["Role", site.role],
    ["Focus", site.focus],
    ["Base", site.base],
    ...skillGroups.map((g): [string, string] => [g.title, g.items.join(", ")]),
  ];
</script>

<svelte:window {onkeydown} />

{#if open}
  <div role="dialog" aria-modal="true" aria-label="Menu" class="no-scrollbar fixed inset-0 z-[80] overflow-y-auto bg-ink/95 backdrop-blur-sm">
    <div class="{COL} flex justify-end gap-4 py-4 font-mono text-[13px] font-medium tracking-[0.06em]">
      {#if level !== "main"}<button onclick={() => (level = "main")}>[BACK]</button>{/if}
      <button onclick={onclose}>[CLOSE]</button>
    </div>

    {#if level === "main"}
      <nav class="flex min-h-[70svh] flex-col items-center justify-center gap-6">
        <button onclick={() => (level = "work")} class={big}>WORK</button>
        <button onclick={() => (level = "lab")} class={big}>LAB</button>
        <button onclick={() => (level = "about")} class={big}>ABOUT</button>
        <button onclick={() => { onclose(); oncontact(); }} class={big}>CONTACT</button>
      </nav>

    {:else if level === "work"}
      <nav data-accordion class="flex min-h-[70svh] flex-col items-center justify-start gap-4 px-4 pb-24 pt-[18svh] text-center">
        {#each projects as p (p.slug)}
          <div class="menu-link max-w-[46ch]">
            <button onclick={(event) => toggleDescription(event, "work", p.slug)} aria-expanded={openWork === p.slug} aria-controls="work-description-{p.slug}" class="{item} hover:opacity-70">
              {p.title} <span class="font-medium opacity-80">‘{p.type}’</span>
            </button>
              <div id="work-description-{p.slug}" data-description={p.slug} inert={openWork !== p.slug} aria-hidden={openWork !== p.slug} class="flow-root overflow-hidden" style="height: 0; opacity: 0;">
                <p class="mt-2 font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/70">{p.what}</p>
                <a href="#/work/{p.slug}" onclick={(event) => { event.preventDefault(); nav(`/work/${p.slug}`)(); }} class="mt-3 inline-block font-mono text-[11px] font-semibold uppercase hover:opacity-70">[View project ↗]</a>
              </div>
          </div>
        {/each}
      </nav>

    {:else if level === "lab"}
      <!-- Lab items open in place: tap a title to show what it is. -->
      <div data-accordion class="flex min-h-[70svh] flex-col items-center justify-start gap-4 px-4 pb-24 pt-[18svh] text-center">
        {#each labItems as l (l.slug)}
          <div class="menu-link max-w-[46ch]">
            <button onclick={(event) => toggleDescription(event, "lab", l.slug)} aria-expanded={openLab === l.slug} aria-controls="lab-description-{l.slug}" class="{item} hover:opacity-70">
              {l.title} <span class="font-medium opacity-80">‘{l.kind}’</span>
            </button>
            <div id="lab-description-{l.slug}" data-description={l.slug} inert={openLab !== l.slug} aria-hidden={openLab !== l.slug} class="flow-root overflow-hidden" style="height: 0; opacity: 0;">
              <p class="mt-2 font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/70">{l.body}</p>
              <p class="mt-1 font-mono text-[11px] uppercase text-accent/55">{l.status}</p>
              <a href="#/lab/{l.slug}" onclick={(event) => { event.preventDefault(); nav(`/lab/${l.slug}`)(); }} class="mt-3 inline-block font-mono text-[11px] font-semibold uppercase hover:opacity-70">[View project ↗]</a>
            </div>
          </div>
        {/each}
      </div>

    {:else}
      <div class="{COL} flex min-h-[70svh] flex-col items-center justify-center gap-6 text-center">
        <p class="{item}">{site.name} <span class="font-medium opacity-80">‘{site.role}’</span></p>
        <p class="menu-link max-w-[46ch] font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/75">
          I build custom AI production tools around ComfyUI, choosing the right image, video, audio and music models for each project and connecting them in one pipeline. Before AI, I spent 12+ years as an FX artist at ILM, DNEG, Sony Imageworks, MPC and Luma Pictures.
        </p>
        <div class="menu-link font-mono text-[11.5px] uppercase leading-[1.7]">
          {#each aboutRows as [k, v] (k)}
            <p><span class="font-medium text-accent/55">{k}:</span> <span class="font-bold">{v}</span></p>
          {/each}
        </div>
        <div class="menu-link flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.06em] text-accent/60">
          {#each site.links as l (l.label)}<a href={l.href} target="_blank" rel="noopener" class="hover:text-accent">{l.label}</a>{/each}
        </div>
      </div>
    {/if}
  </div>
{/if}
