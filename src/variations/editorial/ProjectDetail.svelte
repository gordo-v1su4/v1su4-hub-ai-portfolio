<script lang="ts">
  import { all, work, lab, href, type Entry } from './data';
  import { reveal, press } from './motion';
  import Frame from './Frame.svelte';
  let { slug }: {slug: string} = $props();
  const p = $derived(all.find(p=>p.slug === slug));
  const next = $derived.by(() => { if (!p) return undefined; const list = p.experimental ? lab : work; return list[(list.indexOf(p)+1)%list.length]; });
</script>
<div use:reveal={true} class="page-width pt-20 lg:pt-28">
{#if p}
  <a href={p.experimental ? '#/lab' : '#/'} data-scroll-reveal onpointerdown={press} class="label inline-flex min-h-11 items-center gap-2 text-zinc-500 hover:text-zinc-100">← {p.experimental ? 'Lab' : 'Portfolio'} index</a>
  <header class="mt-6">
    <p data-scroll-reveal class="kicker">{p.category}</p>
    <h1 data-scroll-reveal class="display-title mt-5 text-[clamp(3.2rem,12vw,9rem)] text-zinc-50">{p.title}</h1>
    <div class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
      <p data-scroll-reveal class="max-w-2xl font-mono text-[14px] leading-relaxed text-zinc-300 sm:text-[15px]">{p.summary}</p>
      <div data-scroll-reveal class="space-y-4"><div class="flex flex-wrap items-center gap-3"><span class="status-pill">{p.status}</span><span class="label text-zinc-600">{p.year}</span></div>
        {#if p.experimental}<p class="font-mono text-[12.5px] leading-relaxed text-zinc-500">Experimental project in development. Features and workflows may change.</p>{/if}
        <div class="flex flex-wrap gap-3">{#if p.link}<a href={p.link} target="_blank" rel="noopener noreferrer" onpointerdown={press} class="button-solid">Open App ↗</a>{/if}<a href={p.experimental ? '#/lab' : '#/'} onpointerdown={press} class="button-outline">All projects ←</a></div>
        {#if !p.link}<p class="max-w-md border border-dashed border-white/12 p-3 font-mono text-[12px] leading-relaxed text-zinc-500">{p.experimental ? 'A public demo is not available yet. Follow this page for the project overview.' : 'No public application is available yet.'}</p>{/if}
      </div>
    </div>
  </header>
  <section class="mt-14 grid gap-8 border-t border-white/8 pt-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-16 lg:pt-16"><h2 data-scroll-reveal class="font-narrow text-[26px] font-semibold text-zinc-100 sm:text-[32px]">The project</h2><div data-scroll-reveal><p class="max-w-2xl font-narrow text-[19px] leading-[1.55] text-zinc-200 sm:text-[22px]">{p.line}</p><dl class="mt-6 grid grid-cols-2 gap-6"><div><dt class="label text-zinc-600">Role</dt><dd class="mt-2 font-narrow text-[17px] text-zinc-100">{p.role}</dd></div><div><dt class="label text-zinc-600">Status</dt><dd class="mt-2 font-narrow text-[17px] text-zinc-100">{p.status}</dd></div></dl></div></section>

  {#if p.flow.length}<section class="mt-16 border-t border-white/8 pt-10 lg:mt-24 lg:pt-14"><h2 data-scroll-reveal class="font-narrow text-[26px] font-semibold text-zinc-100 sm:text-[32px]">How it works</h2><ol class="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">{#each p.flow as step, i (step.label)}<li data-scroll-reveal class="border-t border-white/10 pt-4"><div class="flex items-baseline gap-3"><span class="label text-zinc-400">{String(i+1).padStart(2,'0')}</span><h3 class="font-narrow text-[19px] font-semibold text-zinc-100">{step.label}</h3></div><p class="mt-3 font-mono text-[13px] leading-relaxed text-zinc-400">{step.sub}</p></li>{/each}</ol></section>{/if}
  <div data-scroll-reveal class="mt-6"><Frame src={p.image} alt={`${p.title} main image`} eager natural={p.imageFit === 'contain'} cropSides={p.slug === 'frame-lab' ? 0.2 : 0} /><p class="label mt-3 text-zinc-600">{p.title} — {p.year}</p></div>
  {#each p.media as image, i (`${image}-${i}`)}<div data-scroll-reveal class="mt-14"><Frame src={image} alt={`${p.title} screenshot ${i+1}`} natural monochrome={p.slug === 'frame-lab'} /></div>{/each}
  {#if p.stack.length}<section class="mt-16 border-t border-white/8 pt-10 lg:mt-24 lg:pt-14"><h2 data-scroll-reveal class="font-narrow text-[26px] font-semibold text-zinc-100 sm:text-[32px]">Stack & build</h2><ul data-scroll-reveal class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{#each p.stack as item (item)}<li class="border border-white/8 bg-white/[0.015] p-5 font-mono text-[13px] text-zinc-300">{item}</li>{/each}</ul></section>{/if}
  {#if next}<section class="mt-20 border-t border-white/8 pt-10 lg:mt-28"><p data-scroll-reveal class="label text-zinc-600">Next {p.experimental ? 'experiment' : 'project'}</p><a href={href(next)} data-scroll-reveal onpointerdown={press} class="group mt-4 flex items-end justify-between gap-4 border-b border-white/10 pb-6"><span class="display-title text-[clamp(2.6rem,9vw,7rem)] text-zinc-500 group-hover:text-zinc-50">{next.title}</span><span class="text-zinc-400">→</span></a></section>{/if}
{:else}
  <h1 class="display-title text-7xl text-zinc-100">Project not found</h1><a href="#/" class="button-outline mt-8">Back to index</a>
{/if}
</div>
