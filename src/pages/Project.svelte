<script lang="ts">
  import { onMount } from "svelte";
  import { portfolioProjects } from "../data/projects";

  const projects = portfolioProjects();
  import Caption from "../lib/Caption.svelte";
  import Carousel from "../lib/Carousel.svelte";
  import CreditLines from "../lib/CreditLines.svelte";
  import MediaSlot from "../lib/MediaSlot.svelte";
  import Still from "../lib/Still.svelte";
  import { gsap } from "../lib/gsap";
  import { COL, go, reduceMotion } from "../lib/router.svelte";

  let { slug }: { slug: string } = $props();

  const p = $derived(projects.find((x) => x.slug === slug) ?? projects[0]);
  const next = $derived(projects[(projects.findIndex((x) => x.slug === p.slug) + 1) % projects.length]);
  // Real media when added in data; otherwise two empty slots (one above the carousel, one below).
  const media = $derived<(string | undefined)[]>(p.media?.length ? p.media : [undefined, undefined]);
  const WIDE = "mx-auto w-full max-w-[1200px] px-4 md:px-8";

  let hero: HTMLDivElement;
  onMount(() => {
    if (reduceMotion()) return;
    gsap.fromTo(hero.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out", delay: 0.15 });
  });
</script>

<!-- Full-bleed hero under the glass header, then a centered text column. -->
<div class={p.imageFit === "contain" ? "pt-[68px]" : ""}>
  <Still src={p.cover} fit={p.imageFit} on class="h-[72svh] w-full md:h-[92svh]" />
</div>
<div bind:this={hero} class="mx-auto w-full max-w-[640px] px-4">
  <p class="pt-12 text-center font-mono text-[15px] font-bold uppercase tracking-[0.03em]">
    {p.title} <span>‘{p.type}’</span>
  </p>
  <p class="mt-10 font-mono text-[14px] font-bold uppercase leading-[1.45] tracking-[0.02em]">{p.tagline}</p>
  <p class="mt-4 font-mono text-[12px] font-medium uppercase leading-[1.6] text-accent/70">{p.what}</p>

  <h2 class="mt-10 font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">Credits</h2>
  <div class="mt-3">
    <CreditLines rows={[["Role", p.role], ["Stack", p.stack.join(", ")], ["Status", p.status], ["Year", p.year]]} />
  </div>
  <p class="mt-6 font-mono text-[13px] font-semibold uppercase tracking-[0.03em]">
    {#if p.link}
      <a href={p.link} target="_blank" rel="noopener" class="hover:opacity-70">[{p.linkLabel ?? 'Open app'} ↗]</a>
    {:else}
      <span class="text-accent/60">[{p.status}]</span>
    {/if}
  </p>
</div>

<!-- One centered image or video between the text and the carousel. -->
<div class="{WIDE} mt-16">
  <div class="mx-auto w-full max-w-[900px]">
    {#if media[0]}<Still src={media[0]} fit={p.imageFit} />{:else}<MediaSlot n={1} />{/if}
  </div>
</div>

{#if p.horizontal}
  <div class="mt-12"><Carousel {p} /></div>
{:else}
  <div class="mx-auto mt-16 w-full max-w-[640px] px-4">
    <h2 class="font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">How it works</h2>
    <div class="mt-3">
      <CreditLines rows={p.flow.map((s, i): [string, string] => [`${String(i + 1).padStart(2, "0")} ${s.label}`, s.sub])} />
    </div>
  </div>
{/if}

<!-- The rest of the media, stacked and centered. -->
<div class="{WIDE} mt-12 flex flex-col items-center gap-12">
  {#each media.slice(1) as src, i (i)}
    <div class="w-full max-w-[900px]">
      {#if src}<Still {src} fit={p.imageFit} />{:else}<MediaSlot n={i + 2} />{/if}
    </div>
  {/each}
</div>

<div class="{COL} mt-24">
  <button onclick={() => go(`/work/${next.slug}`)} class="group block w-full text-left">
    <Still src={next.cover} fit={next.imageFit} />
    <Caption name={next.title} sub="Next" />
  </button>
</div>
