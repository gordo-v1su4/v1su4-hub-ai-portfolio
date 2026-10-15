<script lang="ts">
  import { portfolioProjects } from "../../data/projects";
  import { go } from "../../lib/router.svelte";

  const projects = portfolioProjects();
  let { slug }: { slug: string } = $props();
  const p = $derived(projects.find((x) => x.slug === slug) ?? projects[0]);
  const next = $derived(projects[(projects.findIndex((x) => x.slug === p.slug) + 1) % projects.length]);
</script>

<!-- Full-bleed hero -->
<section class="relative flex min-h-[78svh] items-end overflow-hidden">
  <img src={p.cover} alt="" class="wow-hero-img" fetchpriority="high" />
  <div class="absolute inset-0" style="background: linear-gradient(180deg, rgba(7,9,13,0.35) 0%, rgba(7,9,13,0.1) 40%, rgba(7,9,13,0.92) 100%)"></div>
  <div class="relative w-full px-4 pb-10 pt-28 md:px-10">
    <button onclick={() => go("/wow")} class="wow-mono text-[12px] text-[#f2ede3]/60 hover:text-[#ffb03a]">← All work</button>
    <h1 class="wow-display mt-4 text-[14vw] leading-[0.85] md:text-[8vw]">{p.title}</h1>
    <p class="wow-mono mt-3 text-[12px] text-[#ffb03a]">{p.type} · {p.year} · {p.status}</p>
    <p class="mt-4 max-w-[58ch] text-[16px] font-medium leading-[1.5]">{p.tagline}</p>
  </div>
</section>

<div class="wow-beats" aria-hidden="true"></div>

<!-- Body: left editorial column + sticky meta -->
<section class="grid gap-10 px-4 py-12 md:grid-cols-[1fr_300px] md:px-10 md:py-16">
  <div>
    <p class="max-w-[62ch] text-[15px] leading-[1.65] text-[#f2ede3]/85">{p.what}</p>

    <h2 class="wow-mono mt-10 text-[11px] text-[#f2ede3]/50">How it works</h2>
    <div class="wow-flow-strip mt-4">
      {#each p.flow as s, i (s.label)}
        <div class="wow-flow-cell">
          <p class="wow-mono text-[11px] text-[#ffb03a]">{String(i + 1).padStart(2, "0")}</p>
          <p class="mt-1 text-[14px] font-bold">{s.label}</p>
          <p class="mt-1 text-[12.5px] text-[#f2ede3]/60">{s.sub}</p>
        </div>
      {/each}
    </div>

    {#if p.media?.length}
      <div class="mt-10 flex flex-col gap-6">
        {#each p.media as src (src)}
          <span class="wow-still block aspect-[16/9]"><img {src} alt="" loading="lazy" /></span>
        {/each}
      </div>
    {:else}
      <p class="wow-mono mt-10 border border-dashed border-white/20 p-5 text-[11px] leading-[1.7] text-[#f2ede3]/45">
        Case-study captures go here — add <span class="text-[#7df0ff]">media: [...]</span> in data/projects.ts
        and they appear in this slot automatically.
      </p>
    {/if}
  </div>

  <aside class="h-fit md:sticky md:top-24">
    <div class="border border-white/15 p-5">
      <p class="wow-mono text-[11px] text-[#f2ede3]/50">Credits</p>
      <dl class="wow-mono mt-3 text-[12px] leading-[2]">
        <div class="flex justify-between gap-4"><dt class="text-[#f2ede3]/45">Role</dt><dd class="text-right">{p.role}</dd></div>
        <div class="flex justify-between gap-4"><dt class="text-[#f2ede3]/45">Stack</dt><dd class="text-right">{p.stack.join(", ")}</dd></div>
        <div class="flex justify-between gap-4"><dt class="text-[#f2ede3]/45">Status</dt><dd class="text-right text-[#ffb03a]">{p.status}</dd></div>
        <div class="flex justify-between gap-4"><dt class="text-[#f2ede3]/45">Year</dt><dd class="text-right">{p.year}</dd></div>
      </dl>
      {#if p.link}
        <a href={p.link} target="_blank" rel="noopener" class="wow-btn mt-5 w-full justify-center">Open app ↗</a>
      {/if}
    </div>
  </aside>
</section>

<!-- Next -->
<button onclick={() => go(`/wow/work/${next.slug}`)} class="group block w-full border-t border-white/10 text-left">
  <span class="relative block overflow-hidden">
    <img src={next.cover} alt="" loading="lazy" class="h-[38vh] w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100 md:h-[52vh]" />
    <span class="absolute bottom-5 left-4 md:left-10">
      <span class="wow-mono text-[11px] text-[#7df0ff]">Next</span>
      <span class="wow-display block text-[10vw] md:text-[5vw]">{next.title}</span>
    </span>
  </span>
</button>
