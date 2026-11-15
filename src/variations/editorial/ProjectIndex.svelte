<script lang="ts">
  import { tick, onDestroy } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { href, type Entry } from './data';
  import Frame from './Frame.svelte';
  import StatusPill from './StatusPill.svelte';
  import { gsap, D, EASE_IO, reduced, press, reveal } from './motion';

  let { items, experimental = false }: { items: Entry[]; experimental?: boolean } = $props();
  const desktop = new MediaQuery('(min-width: 1024px)');

  let selected = $state(0);
  const active = $derived(items[selected] ?? items[0]);

  let layers = $state<HTMLDivElement>();
  let copy = $state<HTMLDivElement>();
  let list = $state<HTMLUListElement>();

  let transitionLock = false;
  let queuedIndex: number | null = null;
  let runId = 0;

  function runPreviewTransition(index: number, request: number): Promise<void> {
    if (!layers || !copy) return Promise.resolve();
    if (reduced()) {
      const images = layers.querySelectorAll('[data-layer]');
      images.forEach((el, i) => gsap.set(el, { opacity: i === index ? 1 : 0 }));
      gsap.set(copy.querySelectorAll('[data-pv]'), { opacity: 1, y: 0 });
      return Promise.resolve();
    }

    const duration = D.fast;
    const images = layers.querySelectorAll('[data-layer]');
    const copyBits = copy.querySelectorAll('[data-pv]');

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        defaults: { ease: EASE_IO, overwrite: false },
        onComplete: () => resolve(),
      });

      images.forEach((el, i) => {
        if (i !== index) tl.to(el, { opacity: 0, duration }, 0);
      });
      const image = images[index];
      if (image) tl.fromTo(image, { opacity: 0 }, { opacity: 1, duration }, 0);
      if (copyBits.length) {
        tl.fromTo(copyBits, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration, stagger: 0 }, 0);
      }
    });
  }

  async function select(index: number) {
    if (index < 0 || index >= items.length) return;
    if (index === selected) return;

    if (transitionLock) {
      queuedIndex = index;
      return;
    }

    transitionLock = true;
    const request = ++runId;

    selected = index;
    await tick();
    if (request !== runId) return;

    await runPreviewTransition(index, request);
    if (request !== runId) return;

    finishTransition(request);
  }

  function finishTransition(request: number) {
    if (request !== runId) return;
    transitionLock = false;
    const next = queuedIndex;
    queuedIndex = null;
    if (next !== null && next !== selected) void select(next);
  }

  function keyboard(e: KeyboardEvent) {
    const direction: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number;
    if (e.key in direction) next = (selected + direction[e.key] + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else if (e.key === 'Enter') {
      e.preventDefault();
      window.location.hash = href(active).slice(1);
      return;
    } else return;
    e.preventDefault();
    void select(next);
    list?.querySelectorAll<HTMLElement>('[role="option"]')[next]?.focus();
  }

  onDestroy(() => {
    runId++;
    transitionLock = false;
    queuedIndex = null;
    if (layers) gsap.killTweensOf(layers.querySelectorAll('[data-layer]'));
    if (copy) gsap.killTweensOf(copy.querySelectorAll('[data-pv]'));
  });
</script>

<section aria-label="Project index">
{#if desktop.current}
  <div class="grid grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] gap-10 xl:gap-16">
    <div data-reveal class="flex flex-col">
      <div class="mb-1 flex items-center justify-between pb-2">
        <p class="label text-zinc-500">{experimental ? 'Experiment' : 'Project'} · {String(items.length).padStart(2,'0')}</p>
        <p class="label text-zinc-600">↑↓ browse · ↵ open</p>
      </div>
      <ul bind:this={list} role="listbox" aria-label="Projects" class="flex flex-col gap-2">
        {#each items as p, i (p.slug)}
          <li role="presentation">
            <div
              role="option"
              aria-selected={i === selected}
              tabindex={i === selected ? 0 : -1}
              onkeydown={keyboard}
              onmouseenter={() => select(i)}
              onclick={(e) => {
                if ((e.target as HTMLElement).closest('a')) return;
                if (i === selected) window.location.hash = href(p).slice(1);
                else void select(i);
              }}
              class={`group relative flex w-full cursor-pointer items-center gap-5 rounded-[2px] py-[13px] pl-3 text-left transition-colors duration-150 ${i === selected ? 'bg-white/[0.025]' : 'hover:bg-white/[0.02]'}`}
            >
            <span aria-hidden="true" class={`absolute inset-y-0 left-0 w-[2px] bg-accent transition-transform duration-200 ${i === selected ? 'scale-y-100' : 'scale-y-0'}`}></span>
            <span class={`label w-8 shrink-0 ${i === selected ? 'text-accent-2' : 'text-zinc-600'}`}>{String(i+1).padStart(2,'0')}</span>
            <span class="min-w-0 flex-1">
              <a href={href(p)} onpointerdown={press} class={`display-title block text-[clamp(1.42rem,2.1vw,2rem)] hover:text-zinc-50 ${i === selected ? 'text-zinc-50' : 'text-zinc-500'}`}>{p.title}</a>
              <span class="mt-1 block max-w-md truncate font-mono text-[11px] leading-relaxed text-zinc-500">{p.line}</span>
            </span>
            {#if i === selected}
              <a href={href(p)} onpointerdown={press} class="label shrink-0 pr-3 text-zinc-500 hover:text-zinc-200">View →</a>
            {:else}
              <span aria-hidden="true" class="label shrink-0 pr-3 text-zinc-600">·</span>
            {/if}
            </div>
          </li>
        {/each}
      </ul>
    </div>
    <div class="sticky top-24">
      <div class="flex items-center justify-between pb-3"><p class="label text-zinc-500">{active.category}</p><p class="label text-zinc-600">{String(selected+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</p></div>
      <a
        href={href(active)}
        onpointerdown={press}
        aria-label={`View ${active.title} project`}
        class="relative block aspect-[16/10] overflow-hidden bg-ink-2 ring-1 ring-white/10 transition-[box-shadow] hover:ring-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div bind:this={layers} class="absolute inset-0">
        {#each items as p, i (p.slug)}
          <div data-layer style:opacity={i === selected ? 1 : 0} style:z-index={i === selected ? 2 : 1} class="absolute inset-0" style:background-color={p.slug === 'review-room' ? '#080e0d' : p.slug === 'frame-lab' ? '#0a0a0a' : undefined}>
          <img src={p.previewImage ?? p.image} alt={i === selected ? `${p.title} project preview` : ''} aria-hidden={i !== selected}
            loading={i === 0 ? 'eager' : 'lazy'} decoding="async" draggable="false"
            class="absolute inset-0 h-full w-full object-center" style:object-fit={p.slug === 'gods-gatekeepers' ? 'cover' : p.imageFit ?? "cover"} />
          {#if p.slug === 'gods-gatekeepers'}
            <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]" style="background:linear-gradient(to top,rgba(0,0,0,.65),transparent)"></div>
          {/if}
          </div>
        {/each}
        </div>
        <div aria-hidden="true" class="pointer-events-none absolute bottom-3 left-3 z-10 flex gap-1.5">{#each items as p, i (p.slug)}<span class={`h-[2px] transition-all duration-300 ${i === selected ? 'w-6 bg-accent-2' : 'w-2.5 bg-white/25'}`}></span>{/each}</div>
        {#if experimental}<span class="label pointer-events-none absolute left-3 top-3 z-10 border border-dashed border-white/20 bg-ink/70 px-2 py-1 text-zinc-400">Experiment</span>{/if}
      </a>
      <div bind:this={copy} aria-live="polite" class="pt-5">
        <h3 data-pv class="display-title text-[clamp(2rem,3vw,3rem)]">
          <a href={href(active)} onpointerdown={press} class="text-zinc-50 hover:text-white">{active.title}</a>
        </h3>
        {#if active.format}<p data-pv class="mt-2 font-mono text-[12px] tracking-[0.04em] text-zinc-500">{active.format}</p>{/if}
        <p data-pv class="mt-2 max-w-xl truncate font-mono text-[13px] leading-relaxed text-zinc-400">{active.line}</p>
        <div data-pv class="mt-5 flex flex-wrap items-center gap-3"><StatusPill status={active.status} statusNote={active.statusNote} /><span class="label text-zinc-600">{active.year}</span></div>
        <div data-pv class="mt-6 flex flex-wrap gap-3"><a href={href(active)} onpointerdown={press} class="button-solid">View Project →</a>
          {#if active.link}<a href={active.link} target="_blank" rel="noopener noreferrer" onpointerdown={press} class="button-outline">{active.linkLabel ?? 'Open app'} ↗</a>{:else}<span class="label flex min-h-8 items-center border border-dashed border-white/12 px-4 text-zinc-500">In development</span>{/if}</div>
      </div>
    </div>
  </div>
{:else}
  <ul>{#each items as p, i (p.slug)}
    <li use:reveal={true}><a data-scroll-reveal href={href(p)} onpointerdown={press} class="block py-[15px] active:bg-white/[0.03]">
      <div class="flex items-center justify-between gap-3"><p class="label text-zinc-500">{String(i+1).padStart(2,'0')} · {p.category}</p><StatusPill status={p.status} statusNote={p.statusNote} /></div>
      <h3 class="display-title mt-2 text-[clamp(1.58rem,7.5vw,2.18rem)] text-zinc-50">{p.title} <span class="float-right text-zinc-500">→</span></h3>
      <p class="mt-2 truncate font-mono text-[12.5px] leading-relaxed text-zinc-400">{p.line}</p>
      <div class="relative mt-4">
      <Frame
        src={p.previewImage ?? p.image}
        alt={`${p.title} project preview`}
        eager={i < 2}
        class={p.slug === 'gods-gatekeepers' ? '[&_img]:object-cover' : ''}
      />
      {#if p.slug === 'gods-gatekeepers'}
        <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]" style="background:linear-gradient(to top,rgba(0,0,0,.65),transparent)"></div>
      {/if}
      </div>
    </a></li>
  {/each}</ul>
{/if}
</section>
