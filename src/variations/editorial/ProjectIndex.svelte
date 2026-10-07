<script lang="ts">
  import { tick, onDestroy } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { href, type Entry } from './data';
  import Frame from './Frame.svelte';
  import { gsap, D, EASE, EASE_IO, reduced, press } from './motion';
  let { items, experimental = false }: {items: Entry[]; experimental?: boolean} = $props();
  const desktop = new MediaQuery('(min-width: 1024px)');
  let selected = $state(0);
  const active = $derived(items[selected] ?? items[0]);
  let layers = $state<HTMLDivElement>();
  let copy = $state<HTMLDivElement>();
  let list = $state<HTMLUListElement>();
  let generation = 0;
  async function select(index: number) {
    if (index === selected) return;
    selected = index;
    const request = ++generation;
    await tick();
    if (request !== generation || !layers || !copy) return;
    const images = layers.querySelectorAll('[data-layer]');
    images.forEach((el, i) => {
      if (i !== index) gsap.to(el, { opacity: 0, duration: reduced() ? 0 : D.fast, ease: EASE_IO, overwrite: 'auto' });
    });
    const image = images[index];
    if (reduced()) gsap.set(image, {opacity: 1, scale: 1});
    else {
      gsap.fromTo(image, {opacity: 0, scale: 1.03}, {opacity: 1, scale: 1, duration: D.base + 0.1, ease: EASE, overwrite: 'auto'});
      gsap.fromTo(copy.querySelectorAll('[data-pv]'), {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: D.base, ease: EASE, stagger: 0.045, overwrite: 'auto'});
    }
  }
  function keyboard(e: KeyboardEvent) {
    const direction: Record<string, number> = {ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1};
    let next: number;
    if (e.key in direction) next = (selected + direction[e.key] + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else if (e.key === 'Enter') { e.preventDefault(); window.location.hash = href(active).slice(1); return; }
    else return;
    e.preventDefault(); void select(next); list?.querySelectorAll('button')[next]?.focus();
  }
  onDestroy(() => {
    generation++;
    if (layers) gsap.killTweensOf(layers.querySelectorAll('[data-layer]'));
    if (copy) gsap.killTweensOf(copy.querySelectorAll('[data-pv]'));
  });
</script>

<section aria-label="Project index">
{#if desktop.current}
  <div class="grid grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] items-start gap-10 xl:gap-16">
    <div data-reveal>
      <div class="mb-2 flex items-center justify-between border-b border-white/10 pb-3">
        <p class="label text-zinc-500">{experimental ? 'Experiment' : 'Project'} · {String(items.length).padStart(2,'0')}</p>
        <p class="label text-zinc-600">↑↓ browse · ↵ open</p>
      </div>
      <ul bind:this={list} class="border-b border-white/10">
        {#each items as p, i (p.slug)}
          <li><button type="button" tabindex={i === selected ? 0 : -1} aria-current={i === selected ? 'true' : undefined}
            onkeydown={keyboard} onpointerdown={press} onmouseenter={() => select(i)}
            onclick={() => i === selected ? window.location.hash = href(p).slice(1) : select(i)}
            class={`group relative flex w-full items-center gap-5 rounded-[2px] py-[18px] pl-3 text-left transition-colors duration-150 ${i === selected ? 'bg-white/[0.025]' : 'hover:bg-white/[0.02]'}`}>
            <span aria-hidden="true" class={`absolute inset-y-[10px] left-0 w-[2px] bg-accent transition-transform duration-200 ${i === selected ? 'scale-y-100' : 'scale-y-0'}`}></span>
            <span class={`label w-8 shrink-0 ${i === selected ? 'text-accent-2' : 'text-zinc-600'}`}>{String(i+1).padStart(2,'0')}</span>
            <span class="min-w-0 flex-1"><span class={`display-title block text-[clamp(1.9rem,2.8vw,2.65rem)] ${i === selected ? 'text-zinc-50' : 'text-zinc-500'}`}>{p.title}</span>
              <span class="mt-2 block max-w-md font-mono text-[11px] leading-relaxed text-zinc-500">{p.line}</span></span>
            <span class="label shrink-0 pr-3 text-zinc-500">{i === selected ? 'View →' : '·'}</span>
          </button></li>
        {/each}
      </ul>
      <p class="mt-5 font-mono text-[12px] leading-relaxed text-zinc-600">Hover or arrow through the index — the preview swaps without moving the list. Click to open the full project.</p>
    </div>
    <div class="sticky top-24">
      <div class="flex items-center justify-between pb-3"><p class="label text-zinc-500">{active.category}</p><p class="label text-zinc-600">{String(selected+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</p></div>
      <div bind:this={layers} class="relative aspect-[16/10] overflow-hidden bg-ink-2 ring-1 ring-white/10">
        {#each items as p, i (p.slug)}
          <div data-layer style:opacity={i === selected ? 1 : 0} style:z-index={i === selected ? 2 : 1} class="absolute inset-0" style:background-color={p.slug === 'review-room' ? '#080e0d' : p.slug === 'frame-lab' ? '#0a0a0a' : undefined}>
          {#if p.imageFit === 'contain' && !['frame-lab', 'review-room'].includes(p.slug)}<img src={p.previewImage ?? p.image} alt="" aria-hidden="true" decoding="async" class="mirrored-image-fill absolute inset-0 h-full w-full object-cover" />{/if}
          <img src={p.previewImage ?? p.image} alt={i === selected ? `${p.title} project preview` : ''} aria-hidden={i !== selected}
            loading={i === 0 ? 'eager' : 'lazy'} decoding="async" draggable="false"
            class={`absolute inset-0 h-full w-full ${['frame-lab', 'review-room'].includes(p.slug) ? 'object-cover object-top' : 'object-contain'}`} />
          </div>
        {/each}
        <div aria-hidden="true" class="pointer-events-none absolute bottom-3 left-3 z-10 flex gap-1.5">{#each items as p, i (p.slug)}<span class={`h-[2px] transition-all duration-300 ${i === selected ? 'w-6 bg-accent-2' : 'w-2.5 bg-white/25'}`}></span>{/each}</div>
        {#if experimental}<span class="label absolute left-3 top-3 z-10 border border-dashed border-white/20 bg-ink/70 px-2 py-1 text-zinc-400">Experiment</span>{/if}
      </div>
      <div bind:this={copy} aria-live="polite" class="min-h-[19.5rem] pt-6 xl:min-h-[20.5rem]">
        <h3 data-pv class="display-title text-[clamp(2rem,3vw,3rem)] text-zinc-50">{active.title}</h3>
        <p data-pv class="mt-3 max-w-xl font-mono text-[13px] leading-relaxed text-zinc-400">{active.summary}</p>
        <div data-pv class="mt-5 flex flex-wrap items-center gap-3"><span class="status-pill">{active.status}</span><span class="label text-zinc-600">{active.year}</span></div>
        <div data-pv class="mt-6 flex flex-wrap gap-3"><a href={href(active)} onpointerdown={press} class="button-solid">View Project →</a>
          {#if active.link}<a href={active.link} target="_blank" rel="noopener noreferrer" onpointerdown={press} class="button-outline">Open App ↗</a>{:else}<span class="label flex min-h-11 items-center border border-dashed border-white/12 px-4 text-zinc-500">No public app</span>{/if}</div>
      </div>
    </div>
  </div>
{:else}
  <ul class="border-t border-white/10">{#each items as p, i (p.slug)}
    <li class="border-b border-white/10"><a href={href(p)} onpointerdown={press} class="block py-5 active:bg-white/[0.03]">
      <div class="flex items-center justify-between gap-3"><p class="label text-zinc-500">{String(i+1).padStart(2,'0')} · {p.category}</p><span class="status-pill shrink-0">{p.status}</span></div>
      <h3 class="display-title mt-3 text-[clamp(2.1rem,10vw,2.9rem)] text-zinc-50">{p.title} <span class="float-right text-zinc-500">→</span></h3>
      <p class="mt-2 font-mono text-[12.5px] leading-relaxed text-zinc-400">{p.line}</p>
      <Frame src={p.previewImage ?? p.image} alt={`${p.title} project preview`} eager={i < 2} natural={p.imageFit === 'contain'} class="mt-4" />
    </a></li>
  {/each}</ul>
{/if}
</section>
