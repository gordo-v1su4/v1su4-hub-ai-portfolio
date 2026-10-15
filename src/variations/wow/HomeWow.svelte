<script lang="ts">
  import { labItems, portfolioProjects, site } from "../../data/projects";
  import { go } from "../../lib/router.svelte";

  const projects = portfolioProjects();
  const featured = projects.filter((p) => p.group === "featured");
  const more = projects.filter((p) => p.group !== "featured");
  const hero = projects.find((p) => p.slug === "beatsmaxxer-pro") ?? projects[0];

  function statusClass(s: string) {
    if (s === "Live") return "is-live";
    if (s === "Beta") return "is-beta";
    return "";
  }
</script>

<!-- HERO — full-viewport show poster. The memorable thing; everything else stays quiet. -->
<section class="relative flex min-h-[92svh] items-end overflow-hidden">
  <img src={hero.cover} alt="" class="wow-hero-img" fetchpriority="high" />
  <div class="absolute inset-0" style="background: linear-gradient(180deg, rgba(7,9,13,0.25) 0%, rgba(7,9,13,0.05) 35%, rgba(7,9,13,0.88) 100%)"></div>

  <div class="relative w-full px-4 pb-10 pt-28 md:px-10 md:pb-14">
    <div class="flex flex-wrap items-center gap-2">
      <span class="wow-tag is-live"><span class="dot"></span>3 live apps</span>
      <span class="wow-tag"><span class="dot"></span>{site.base} — {site.focus}</span>
      <span class="wow-tag is-beta"><span class="dot"></span>Creative technologist</span>
    </div>

    <h1 class="wow-display mt-5 text-[17vw] leading-[0.84] md:text-[11.5vw]">
      V1SU4
      <span class="wow-outline block">Live AI</span>
      visuals
    </h1>

    <div class="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <p class="max-w-[52ch] text-[15px] leading-[1.55] text-[#f2ede3]/85">
        {site.name} builds generative-AI tools for commercials, TV and live shows —
        real-time visuals, beat-locked editing and the pipelines behind them.
        12+ years FX at ILM, DNEG, Sony Imageworks, MPC, Luma.
      </p>
      <div class="flex flex-wrap gap-3">
        <button class="wow-btn" onclick={() => go(`/wow/work/${featured[0]?.slug ?? projects[0].slug}`)}>Watch the work ↓</button>
        <a class="wow-btn ghost" href={site.links[0].href} target="_blank" rel="noopener">GitHub ↗</a>
      </div>
    </div>
  </div>
</section>

<div class="wow-beats" aria-hidden="true"></div>

<!-- Ticker -->
<div class="overflow-hidden border-b border-white/10 py-3" aria-hidden="true">
  <div class="wow-marquee wow-mono text-[11px] text-[#f2ede3]/50">
    {#each Array(2) as _}
      <span>Pindeck · live&ensp;—&ensp;Beatsmaxxer Pro · live&ensp;—&ensp;Frame Lab · live&ensp;—&ensp;Trailer Feed · live&ensp;—&ensp;Project Stack Structure · beta&ensp;—&ensp;Review Room · demo on request&ensp;—&ensp;</span>
    {/each}
  </div>
</div>

<!-- WORK INDEX — left-aligned editorial list, not centered cards -->
<section class="px-4 py-14 md:px-10 md:py-20">
  <div class="flex items-baseline justify-between gap-4">
    <h2 class="wow-display text-[13vw] md:text-[6vw]">Work</h2>
    <p class="wow-mono hidden text-[11px] text-[#f2ede3]/50 md:block">7 projects — tap a row to open</p>
  </div>

  <div class="mt-6">
    {#each projects as p (p.slug)}
      <button onclick={() => go(`/wow/work/${p.slug}`)} class="wow-row group" aria-label="{p.title}, {p.type}">
        <span class="wow-mono text-[12px] text-[#f2ede3]/45">{p.year}<br />{p.status}</span>
        <span>
          <span class="wow-title wow-display block text-[9vw] md:text-[3.4vw]">{p.title}</span>
          <span class="mt-2 block max-w-[60ch] text-[13.5px] leading-[1.5] text-[#f2ede3]/65">{p.tagline}</span>
          <span class="mt-3 flex flex-wrap gap-2">
            <span class="wow-tag {statusClass(p.status)}"><span class="dot"></span>{p.type}</span>
            {#if p.link}<span class="wow-tag">Open app ↗</span>{/if}
          </span>
        </span>
        <span class="wow-still aspect-[16/10] w-full">
          <img src={p.cover} alt="" loading="lazy" />
        </span>
      </button>
    {/each}
  </div>
</section>

<div class="wow-beats" aria-hidden="true"></div>

<!-- TWO LANES -->
<section class="grid gap-0 md:grid-cols-2">
  <div class="border-b border-white/10 px-4 py-12 md:border-b-0 md:border-r md:px-10">
    <p class="wow-mono text-[11px] text-[#ffb03a]">Now shipping</p>
    <h3 class="wow-display mt-3 text-[10vw] md:text-[3vw]">Featured<br />tools</h3>
    <div class="mt-6 flex flex-col gap-4">
      {#each featured as p (p.slug)}
        <button onclick={() => go(`/wow/work/${p.slug}`)} class="group text-left">
          <span class="wow-still block aspect-[16/9]"><img src={p.cover} alt="" loading="lazy" /></span>
          <span class="mt-3 block text-[15px] font-semibold">{p.title} <span class="font-normal text-[#f2ede3]/55">— {p.type}</span></span>
        </button>
      {/each}
    </div>
  </div>
  <div class="px-4 py-12 md:px-10">
    <p class="wow-mono text-[11px] text-[#7df0ff]">More work + lab</p>
    <h3 class="wow-display mt-3 text-[10vw] md:text-[3vw]">Studio<br />&amp; Lab</h3>
    <div class="mt-6 flex flex-col gap-3">
      {#each more as p (p.slug)}
        <button onclick={() => go(`/wow/work/${p.slug}`)} class="flex items-center justify-between gap-4 border-b border-white/10 py-3 text-left hover:text-[#ffb03a]">
          <span class="text-[14px] font-semibold">{p.title}</span>
          <span class="wow-mono text-[11px] text-[#f2ede3]/45">{p.type} · {p.year}</span>
        </button>
      {/each}
      {#each labItems as l (l.slug)}
        <div class="border-b border-white/10 py-3">
          <p class="text-[14px] font-semibold">{l.title} <span class="wow-mono text-[11px] font-normal text-[#7df0ff]">{l.kind}</span></p>
          <p class="mt-1 text-[13px] leading-[1.5] text-[#f2ede3]/60">{l.body}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ABOUT STRIP -->
<section class="border-t border-white/10 bg-[#f2ede3] px-4 py-14 text-[#07090d] md:px-10">
  <p class="wow-mono text-[11px] opacity-60">About — {site.name} ‘{site.role}’</p>
  <p class="wow-display mt-4 max-w-[20ch] text-[9vw] leading-[0.9] md:text-[4vw]">
    AI pipelines for pictures that move.
  </p>
  <div class="mt-8 grid gap-8 md:grid-cols-3">
    <p class="max-w-[42ch] text-[14px] leading-[1.6]">
      Custom AI production tools around ComfyUI — the right image, video, audio and music models
      for each project, connected in one pipeline. Used in production with studios and clients.
    </p>
    <p class="wow-mono text-[12px] leading-[1.9] opacity-70">
      Role — {site.role}<br />Focus — {site.focus}<br />Base — {site.base}<br />Studio — {site.label}
    </p>
    <div class="flex flex-wrap content-start gap-2">
      {#each site.links as l (l.label)}
        <a href={l.href} target="_blank" rel="noopener" class="border border-black/20 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] hover:bg-black hover:text-white">{l.label} ↗</a>
      {/each}
    </div>
  </div>
</section>
