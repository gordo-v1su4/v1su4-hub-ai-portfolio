<script lang="ts">
  import { work, lab, href } from './data';
  import { site, skillGroups } from '../../data/projects';
  import ProjectIndex from './ProjectIndex.svelte';
  import Frame from './Frame.svelte';
  import { reveal } from './motion';
  let { experimental = false }: {experimental?: boolean} = $props();
  const items = $derived(experimental ? lab : work);
  const homepageLab = lab.filter(project => ['creative-studio-pro', 'music-video-agent'].includes(project.slug));
</script>
<div use:reveal>
  <header class="pb-4 pt-22 sm:pb-5 sm:pt-24 lg:pt-26" class:portfolio-intro={!experimental}>
    <div class="page-width flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        <p data-reveal class={`kicker ${experimental ? '' : 'portfolio-heading-line'}`}>{experimental ? 'V1SU4 · Lab — work in progress' : 'Creative Production Portfolio and Software'}</p>
        <h1 data-reveal class={`display-title ${experimental ? 'mt-2' : 'mt-4'} text-[clamp(2rem,5vw,3.25rem)] text-zinc-50`}>{experimental ? 'The lab' : 'Selected work'}</h1>
        <p data-reveal class="mt-4 max-w-3xl font-mono text-[13.5px] leading-relaxed text-zinc-400 sm:text-[14px]">{experimental ? site.lab : site.mission}</p>
      </div>
      <ul data-reveal class="flex flex-wrap gap-x-5 gap-y-1">
        <li class="label text-zinc-500">{String(items.length).padStart(2,'0')} {experimental ? 'Experiments' : 'Projects'}</li>
        <li class="label text-zinc-600">Miami / LA</li>
      </ul>
    </div>
  </header>
  <div class="page-width pt-5 lg:pt-6"><ProjectIndex {items} {experimental} /></div>
  {#if experimental}
    <section use:reveal={true} class="page-width mt-20 sm:mt-28"><div class="grid gap-8 border border-dashed border-white/12 bg-white/[0.015] p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:gap-14"><h2 data-scroll-reveal class="display-title text-4xl text-zinc-100">Reading<br/>the lab</h2><p class="max-w-2xl font-mono text-[13.5px] leading-relaxed text-zinc-400">These projects are experimental and in development. Features and workflows may change as I use them, learn from them, and decide what to build next.</p></div></section>
  {:else}
    <section use:reveal={true} class="page-width mt-12 sm:mt-16"><div class="flex items-baseline justify-between gap-4"><h2 data-scroll-reveal class="display-title text-[clamp(1.8rem,4vw,3rem)] text-zinc-100">What I do</h2><a href="#/about" class="label text-zinc-500 hover:text-zinc-200">About Gordo →</a></div>
      <div class="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{#each skillGroups as group (group.title)}<div data-scroll-reveal><h3 class="label text-accent">{group.title}</h3><ul class="mt-4 space-y-2">{#each group.items as item (item)}<li class="font-mono text-[13px] text-zinc-400">{item}</li>{/each}</ul></div>{/each}</div>
    </section>
  {/if}
  <section use:reveal={true} class="page-width mt-12 sm:mt-16"><div class="flex items-end justify-between"><h2 data-scroll-reveal class="display-title text-[clamp(1.8rem,4vw,3rem)] text-zinc-100">{experimental ? 'Selected work' : 'Also building'}</h2><a class="label text-zinc-500" href={experimental ? '#/' : '#/lab'}>{experimental ? 'Portfolio index' : 'Into the lab'} →</a></div>
    <ul class="mt-8 grid gap-5 sm:grid-cols-2">{#each (experimental ? work.slice(0,2) : homepageLab) as p (p.slug)}<li data-scroll-reveal><a href={href(p)} class="group flex h-full flex-col border border-white/8 bg-white/[0.015] p-3 hover:border-white/20"><Frame src={p.image} alt={`${p.title} preview`} natural class="mb-4" /><div class="mt-auto flex items-center justify-between gap-3 px-1"><span class="label text-zinc-400">{p.title}</span><span class="label text-zinc-600">{p.status}</span></div></a></li>{/each}</ul>
  </section>
</div>

<style>
  .portfolio-intro { padding-top: 76px; }
  .portfolio-heading-line { color: var(--color-accent-2); }
  .portfolio-heading-line::before { content: none; }
  @media (min-width: 640px) { .portfolio-intro { padding-top: 84px; } }
  @media (min-width: 1024px) { .portfolio-intro { padding-top: 92px; } }
</style>
