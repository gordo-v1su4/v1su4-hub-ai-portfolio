<script lang="ts">
  import { tick } from 'svelte';
  import type { Route } from '../../lib/router.svelte';
  import { site, skillGroups, softwareGroups } from '../../data/projects';
  import { work, lab, all, href } from './data';
  import IndexPage from './IndexPage.svelte';
  import ProjectDetail from './ProjectDetail.svelte';
  import { gsap, reduced, reveal, EASE, D, press } from './motion';
  let { route }: {route: Route} = $props();
  let open = $state(false);
  let solid = $state(window.scrollY > 10);
  let bar: HTMLDivElement;
  let page: HTMLElement;
  let menu: HTMLDivElement;
  let menuButton: HTMLButtonElement;
  let raf = 0;
  const navigation = [{label:'Index',to:'#/',view:'home'},{label:'Lab',to:'#/lab',view:'lab'},{label:'Archives',to:'#/archives',view:'archives'},{label:'About',to:'#/about',view:'about'}];
  const active = $derived(route.view === 'project' ? 'home' : route.view === 'lab-project' ? 'lab' : route.view);
  const title = $derived(all.find(p=>p.slug === route.slug)?.title ?? (route.view === 'home' ? 'Selected work' : route.view === 'lab' ? 'The lab' : route.view === 'archives' ? 'Archives' : 'About Gordo'));
  function scroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => { solid = window.scrollY > 10; const max = document.documentElement.scrollHeight - window.innerHeight; if (bar) gsap.set(bar, {scaleX: max > 0 ? Math.min(1,window.scrollY/max) : 0}); raf = 0; });
  }
  function closeMenu() { open = false; }
  function keydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') { closeMenu(); menuButton?.focus(); }
    if (e.key === 'Tab') {
      const links = [menuButton, ...menu.querySelectorAll<HTMLAnchorElement>('a')];
      const first = links[0], last = links[links.length-1];
      if (e.shiftKey && document.activeElement === first) {e.preventDefault(); last.focus();}
      else if (!e.shiftKey && document.activeElement === last) {e.preventDefault(); first.focus();}
    }
  }
  $effect(() => {
    route; closeMenu();
    if (!page) return;
    const tween = reduced() ? undefined : gsap.fromTo(page, {opacity:0}, {opacity:1,duration:0.3,ease:'power2.out',overwrite:'auto'});
    scroll();
    return () => tween?.kill();
  });
  $effect(() => {
    if (!open || !menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tween = reduced() ? undefined : gsap.fromTo(menu.querySelectorAll('[data-mitem]'),{opacity:0,y:10},{opacity:1,y:0,duration:D.fast+0.08,ease:EASE,stagger:0.045,overwrite:'auto'});
    return () => {document.body.style.overflow = previous; tween?.kill();};
  });
  $effect(() => () => {if(raf) cancelAnimationFrame(raf);});
</script>
<svelte:head><title>{title} — V1SU4 · Gordo</title><meta name="description" content={site.description} /></svelte:head>
<svelte:window onscroll={scroll} onresize={scroll} onkeydown={keydown} />
<div class="min-h-screen">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"><div class="absolute inset-0 bg-grid opacity-70"></div><div class="absolute inset-0 bg-grain opacity-[0.16] mix-blend-soft-light"></div><div class="editorial-vignette absolute inset-0"></div></div>
  <a href="#main" onclick={(e)=>{e.preventDefault(); page?.focus();}} class="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-zinc-100 focus:px-3 focus:py-2 focus:text-ink">Skip to content</a>
  <header class={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${solid || open ? 'border-b border-white/8 bg-ink/72 backdrop-blur-xl supports-[backdrop-filter]:bg-ink/60' : 'border-b border-transparent'}`}>
    <div class="page-width flex h-14 items-center justify-between gap-4 sm:h-16"><a href="#/" aria-label="V1SU4 — home" onpointerdown={press} class="flex items-baseline gap-2.5"><span class="display-title text-[26px] tracking-[0.02em] text-zinc-50 sm:text-[28px]">V1SU4</span><span class="label text-zinc-500">Gordo</span></a>
      <nav aria-label="Main navigation" class="hidden items-center gap-7 md:flex">{#each navigation as n (n.to)}<a href={n.to} aria-current={active === n.view ? 'page' : undefined} class={`label relative py-2 transition-colors ${active === n.view ? 'text-zinc-50' : 'text-zinc-500 hover:text-zinc-200'}`}>{n.label}<span aria-hidden="true" class={`absolute -bottom-0.5 left-0 h-px bg-accent-2 transition-all duration-200 ${active === n.view ? 'w-full' : 'w-0'}`}></span></a>{/each}<span class="label text-zinc-600">Miami / LA</span></nav>
      <button bind:this={menuButton} type="button" onclick={()=>open=!open} aria-expanded={open} aria-controls="mobile-menu" class="label flex h-11 min-w-11 items-center gap-2 rounded-[2px] border border-white/12 px-3 text-zinc-300 md:hidden">{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
    </div>
  </header>
  <div id="mobile-menu" bind:this={menu} hidden={!open} class="fixed inset-0 z-40 flex flex-col bg-ink/95 pt-20 backdrop-blur-xl md:hidden"><nav aria-label="Mobile navigation" class="flex flex-1 flex-col px-5 pt-6">{#each navigation as n,i (n.to)}<a data-mitem href={n.to} onclick={closeMenu} class="flex items-center justify-between border-b border-white/8 py-5"><span class="display-title text-[42px] text-zinc-100">{n.label}</span><span class="label text-zinc-600">{String(i+1).padStart(2,'0')}</span></a>{/each}<p class="label py-6 text-zinc-500">Miami / LA</p></nav><p class="label safe-bottom px-5 text-zinc-600">V1SU4 · Visual stories, experiences & tools</p></div>
  <div bind:this={bar} aria-hidden="true" class="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-accent"></div>
  <main id="main" bind:this={page} tabindex="-1">
    {#key `${route.view}/${route.slug ?? ''}`}
      {#if route.view === 'home' || route.view === 'lab'}<IndexPage experimental={route.view === 'lab'} />
      {:else if route.view === 'project' || route.view === 'lab-project'}<ProjectDetail slug={route.slug ?? ''} />
      {:else if route.view === 'archives'}
        <div use:reveal class="page-width pt-24 lg:pt-32"><p data-reveal class="kicker">V1SU4 · Archives</p><h1 data-reveal class="display-title mt-5 text-[clamp(3.2rem,12vw,9rem)] text-zinc-50">Archives</h1><p data-reveal class="mt-6 max-w-2xl font-mono text-[14px] leading-relaxed text-zinc-400">{site.archives}</p><div data-reveal class="mt-8 flex flex-wrap gap-3">{#each site.links.filter(l=>['VFX REEL','IMDB'].includes(l.label)) as link (link.href)}<a class="button-outline" href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>{/each}</div></div>
      {:else}
        <div use:reveal class="page-width pt-24 lg:pt-32"><header class="relative isolate pb-32 sm:pb-40">
          <p data-reveal class="kicker">V1SU4 · About</p><h1 data-reveal class="display-title mt-5 text-[clamp(3.2rem,12vw,9rem)] text-zinc-50">Gordo</h1><div class="mt-5 max-w-2xl space-y-5 font-mono text-[14px] leading-relaxed text-zinc-400 sm:text-[15px]">{#each site.about as paragraph (paragraph)}<p data-reveal>{paragraph}</p>{/each}</div></header>
          <div class="mt-10 grid gap-8 sm:grid-cols-3">{#each [{label:'Role',value:site.role},{label:'Focus',value:site.focus},{label:'Base',value:site.base}] as fact (fact.label)}<div class="border-t border-white/10 pt-4"><h2 class="label text-zinc-500">{fact.label}</h2><p class="mt-3 font-narrow text-[22px] text-zinc-100">{fact.value}</p></div>{/each}</div>
          <h2 class="display-title mt-16 text-4xl text-zinc-100">Capabilities</h2><div class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{#each skillGroups as group (group.title)}<div class="border-t border-white/10 pt-4"><h3 class="label text-zinc-500">{group.title}</h3><ul class="mt-4 space-y-2">{#each group.items as item (item)}<li class="font-mono text-[13px] text-zinc-300">{item}</li>{/each}</ul></div>{/each}</div>
          <h2 class="display-title mt-16 text-4xl text-zinc-100">Software & tools</h2><div class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{#each softwareGroups as group (group.title)}<div class="border-t border-white/10 pt-4"><h3 class="label text-zinc-500">{group.title}</h3><ul class="mt-4 space-y-2">{#each group.items as item (item)}<li class="font-mono text-[13px] text-zinc-300">{item}</li>{/each}</ul></div>{/each}</div>
        </div>
      {/if}
    {/key}
  </main>
  <footer class={`relative border-t border-white/8 bg-ink/60 ${['project', 'lab-project'].includes(route.view) ? 'mt-8' : 'mt-24 sm:mt-32'}`}><div class="page-width py-14 lg:py-20"><div class="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]"><div><h2 class="display-title max-w-md text-[clamp(1.85rem,5.5vw,3.25rem)] leading-[0.92] text-zinc-50">{site.contactHeading}</h2><p class="mt-4 max-w-sm font-mono text-[13px] leading-relaxed text-zinc-400">{site.contactBody}</p><a href={site.contactUrl} target="_blank" rel="noopener noreferrer" class="button-outline mt-7">Get in touch <span aria-hidden="true" class="text-accent">→</span></a></div>
      {#each [{title:'Portfolio',entries:work},{title:'Lab',entries:lab}] as group (group.title)}<div><h3 class="label text-zinc-500">{group.title}</h3><ul class="mt-5 space-y-3">{#each group.entries as p (p.slug)}<li><a href={href(p)} class="footer-link">{p.title}</a></li>{/each}</ul></div>{/each}
      <div><h3 class="label text-zinc-500">Elsewhere</h3><ul class="mt-5 space-y-3">{#each site.links as link (link.href)}<li><a href={link.href} target="_blank" rel="noopener noreferrer" class="footer-link">{link.label} ↗</a></li>{/each}</ul></div>
    </div><div class="mt-14 flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:justify-between"><p class="label text-zinc-600">© {new Date().getFullYear()} V1SU4 — Gordo</p><p class="label text-zinc-600">Miami / LA</p></div></div></footer>
</div>
