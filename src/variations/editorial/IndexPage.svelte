<script lang="ts">
  import { work, lab, href } from './data';
  import { skillGroups } from '../../data/projects';
  import ProjectIndex from './ProjectIndex.svelte';
  import Frame from './Frame.svelte';
  import { reveal } from './motion';
  let { experimental = false }: {experimental?: boolean} = $props();
  const items = $derived(experimental ? lab : work);
</script>
<div use:reveal>
  <header class="border-b border-white/8 pb-8 pt-22 sm:pb-10 sm:pt-28 lg:pt-28">
    <div class="page-width">
      <p data-reveal class={`kicker ${experimental ? '' : 'portfolio-heading-line'}`}>{experimental ? 'V1SU4 · Lab — work in progress' : 'Creative Production Portfolio and Software'}</p>
      <h1 class="mt-5"><span data-reveal class="display-title block text-[clamp(3.4rem,13vw,10rem)] text-zinc-50">{experimental ? 'The' : 'Selected'}</span>
        <span data-reveal class="display-title block text-[clamp(3.4rem,13vw,10rem)] text-zinc-600">{experimental ? 'Lab' : 'Work'}<span class="ml-3 align-super text-[0.18em] tracking-[0.2em] text-accent-2">{String(items.length).padStart(2,'0')}</span></span></h1>
      <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <p data-reveal class="max-w-2xl font-mono text-[13.5px] leading-relaxed text-zinc-400 sm:text-[14px]">{experimental ? 'Experiments under construction. Explore the ideas, workflows, and current state of each project.' : 'Creative production and the software built around it. Explore the projects, how they work, and the public applications.'}</p>
        <ul data-reveal class="flex flex-wrap gap-x-6 gap-y-2"><li class="label text-zinc-500">{String(items.length).padStart(2,'0')} {experimental ? 'Experiments' : 'Projects'}</li>{#if !experimental}<li class="label text-zinc-500">{String(work.filter(p=>p.link).length).padStart(2,'0')} Public apps</li>{/if}<li class="label text-zinc-500">Miami / LA</li></ul>
      </div>
    </div>
  </header>
  <div class="page-width pt-10 lg:pt-14"><ProjectIndex {items} {experimental} /></div>
  {#if experimental}
    <section use:reveal={true} class="page-width mt-20 sm:mt-28"><div class="grid gap-8 border border-dashed border-white/12 bg-white/[0.015] p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:gap-14"><h2 data-scroll-reveal class="display-title text-4xl text-zinc-100">Reading<br/>the lab</h2><p class="max-w-2xl font-mono text-[13.5px] leading-relaxed text-zinc-400">These projects are experimental and in development. Features and workflows may change. Each has a page here; a public application link appears when one is available.</p></div></section>
  {:else}
    <section use:reveal={true} class="page-width mt-20 sm:mt-28"><div class="flex items-baseline justify-between gap-4"><h2 data-scroll-reveal class="display-title text-[clamp(1.8rem,4vw,3rem)] text-zinc-100">What I do</h2><a href="#/about" class="label text-zinc-500 hover:text-zinc-200">About Gordo →</a></div>
      <div class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{#each skillGroups as group (group.title)}<div data-scroll-reveal class="border-t border-white/10 pt-4"><h3 class="label text-accent">{group.title}</h3><ul class="mt-4 space-y-2">{#each group.items as item (item)}<li class="font-mono text-[13px] text-zinc-400">{item}</li>{/each}</ul></div>{/each}</div>
    </section>
  {/if}
  <section use:reveal={true} class="page-width mt-20 sm:mt-28"><div class="flex items-end justify-between border-t border-white/8 pt-8"><h2 data-scroll-reveal class="display-title text-[clamp(1.8rem,4vw,3rem)] text-zinc-100">{experimental ? 'Selected work' : 'Also building'}</h2><a class="label text-zinc-500" href={experimental ? '#/' : '#/lab'}>{experimental ? 'Portfolio index' : 'Into the lab'} →</a></div>
    <ul class="mt-8 grid gap-5 sm:grid-cols-2">{#each (experimental ? work.slice(0,2) : lab) as p (p.slug)}<li data-scroll-reveal><a href={href(p)} class="group flex h-full flex-col border border-white/8 bg-white/[0.015] p-3 hover:border-white/20"><Frame src={p.image} alt={`${p.title} preview`} natural class="mb-4" /><div class="mt-auto flex items-center justify-between gap-3 px-1"><span class="label text-zinc-400">{p.title}</span><span class="label text-zinc-600">{p.status}</span></div></a></li>{/each}</ul>
  </section>
</div>
