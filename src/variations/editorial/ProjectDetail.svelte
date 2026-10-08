<script lang="ts">
  import { all, work, lab, href, type Entry } from './data';
  import { reveal, press } from './motion';
  import Frame from './Frame.svelte';
  import ImageViewer from './ImageViewer.svelte';
  let { slug }: {slug: string} = $props();
  const p = $derived(all.find(p=>p.slug === slug));
  const next = $derived.by(() => { if (!p) return undefined; const list = p.experimental ? lab : work; return list[(list.indexOf(p)+1)%list.length]; });
  const workflow = $derived(p ? [
    { title: 'Input', steps: p.flow.slice(0, 1) },
    { title: 'Process', steps: p.flow.slice(1, -1) },
    { title: 'Output', steps: p.flow.slice(-1) },
  ] : []);
</script>
<div use:reveal={true} class="page-width pt-20 lg:pt-20">
{#if p}
  <a href={p.experimental ? '#/lab' : '#/'} data-scroll-reveal onpointerdown={press} class="label inline-flex min-h-8 items-center gap-2 text-zinc-500 hover:text-zinc-100">← {p.experimental ? 'Lab' : 'Portfolio'} index</a>
  <header class="mt-4">
    <p data-scroll-reveal class="kicker">{p.category}</p>
    <h1 data-scroll-reveal class="display-title mt-3 text-[clamp(3.2rem,12vw,9rem)] text-zinc-50">{p.title}</h1>
    <div class="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
      <p data-scroll-reveal class="max-w-2xl font-mono text-[14px] leading-relaxed text-zinc-300 sm:text-[15px]">{p.summary}</p>
      <div data-scroll-reveal class="space-y-4"><div class="flex flex-wrap items-center gap-3"><span class="status-pill">{p.status}</span><span class="label text-zinc-600">{p.year}</span></div>
        {#if p.experimental}<p class="font-mono text-[12.5px] leading-relaxed text-zinc-500">Experimental project in development. Features and workflows may change.</p>{/if}
        <div class="flex flex-wrap gap-3">{#if p.link}<a href={p.link} target="_blank" rel="noopener noreferrer" onpointerdown={press} class="button-solid">Open App ↗</a>{/if}<a href={p.experimental ? '#/lab' : '#/'} onpointerdown={press} class="button-outline">All projects ←</a></div>
        {#if !p.link}<p class="max-w-md border border-dashed border-white/12 p-3 font-mono text-[12px] leading-relaxed text-zinc-500">{p.experimental ? 'A public demo is not available yet. Follow this page for the project overview.' : 'No public application is available yet.'}</p>{/if}
      </div>
    </div>
  </header>
  <div data-scroll-reveal class="mt-6">
    {#if p.slug === 'frame-lab'}
      <ImageViewer images={[p.image, ...p.media]} title={p.title} />
    {:else}
      <Frame src={p.image} alt={p.title + ' workspace'} eager natural />
      <p class="label mt-3 text-zinc-500">{p.title} — {p.year}</p>
    {/if}
  </div>
  <section class="mt-8 grid gap-5 border-t border-white/8 pt-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-10"><h2 data-scroll-reveal class="font-narrow text-[26px] font-semibold text-zinc-100 sm:text-[32px]">Why it exists</h2><div data-scroll-reveal><p class="max-w-2xl font-mono text-[14px] leading-relaxed text-zinc-300 sm:text-[15px]">{p.rationale ?? p.line}</p><dl class="mt-6 grid grid-cols-2 gap-6"><div><dt class="label text-zinc-600">Role</dt><dd class="mt-2 font-narrow text-[17px] text-zinc-100">{p.role}</dd></div><div><dt class="label text-zinc-600">Status</dt><dd class="mt-2 font-narrow text-[17px] text-zinc-100">{p.status}</dd></div></dl></div></section>

  {#if p.flow.length}<section class="mt-12 border-t border-white/8 pt-8 lg:mt-16 lg:pt-10"><div class="flex flex-wrap items-baseline justify-between gap-3"><h2 data-scroll-reveal class="font-narrow text-[26px] font-semibold text-zinc-100 sm:text-[32px]">How it works</h2><p data-scroll-reveal class="label text-zinc-500">{p.role}</p></div><ol class="mt-6 grid gap-6 md:grid-cols-3">{#each workflow as group, i (group.title)}<li data-scroll-reveal class="min-w-0"><div class="flex items-baseline gap-3"><span class="label text-accent">{String(i+1).padStart(2,'0')}</span><h3 class="font-narrow text-[19px] font-semibold text-zinc-100">{group.title}</h3></div><ul class="mt-4 space-y-5">{#each group.steps as step (step.label)}<li><h4 class="font-narrow text-[17px] font-semibold text-zinc-100">{step.label}</h4><p class="mt-2 font-mono text-[13px] leading-relaxed text-zinc-400">{step.sub}</p></li>{/each}</ul></li>{/each}</ol></section>{/if}
  {#if p.stack.length}<section class="mt-14 border-t border-white/8 pt-8 lg:mt-20 lg:pt-10"><h2 data-scroll-reveal class="font-narrow text-[26px] font-semibold text-zinc-100 sm:text-[32px]">Stack & build</h2>
    {#if p.stackGroups}
      <div class="mt-6 grid gap-6 sm:grid-cols-3">
        {#each p.stackGroups as group (group.title)}
          <div data-scroll-reveal class="border border-white/8 bg-white/[0.015] p-5">
            <h3 class="label text-zinc-500">{group.title}</h3>
            <ul class="mt-3 space-y-2 font-mono text-[13px] leading-relaxed text-zinc-300">{#each group.items as item (item)}<li>{item}</li>{/each}</ul>
          </div>
        {/each}
      </div>
    {:else}
      <div data-scroll-reveal class="mt-6 border border-white/8 bg-white/[0.015] p-5"><h3 class="label text-zinc-500">Technology</h3><ul class="mt-3 space-y-2 font-mono text-[13px] leading-relaxed text-zinc-300">{#each p.stack as item (item)}<li>{item}</li>{/each}</ul></div>
    {/if}
  </section>{/if}
  {#if next}<section class="mt-64 lg:mt-80"><p data-scroll-reveal class="label text-zinc-600">Next {p.experimental ? 'experiment' : 'project'}</p><a href={href(next)} data-scroll-reveal onpointerdown={press} class="group mt-4 flex items-end justify-between gap-4 pb-2"><span class="display-title text-[clamp(2.6rem,9vw,7rem)] text-zinc-500 group-hover:text-zinc-50">{next.title}</span><span aria-hidden="true" class="text-accent">→</span></a></section>{/if}
{:else}
  <h1 class="display-title text-7xl text-zinc-100">Project not found</h1><a href="#/" class="button-outline mt-8">Back to index</a>
{/if}
</div>
