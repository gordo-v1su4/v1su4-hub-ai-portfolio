<script lang="ts">
  import { projects } from "../../data/projects";
  import { go } from "../../lib/router.svelte";
  import HomeWow from "./HomeWow.svelte";
  import ProjectWow from "./ProjectWow.svelte";
  import "./wow.css";

  let { slug }: { slug?: string } = $props();
  const valid = $derived(slug ? projects.some((p) => p.slug === slug) : true);
</script>

<div class="wow-root min-h-svh">
  <!-- Minimal wow chrome — keeps current Header/Menu untouched -->
  <header class="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#07090d]/70 backdrop-blur-xl">
    <div class="flex items-center justify-between px-4 py-3 md:px-10">
      <button onclick={() => go("/wow")} class="wow-display text-[1.6rem] tracking-tight" aria-label="V1SU4 wow home">V1SU4 <span class="wow-mono align-middle text-[10px] tracking-[0.2em] text-[#ffb03a]">/ wow</span></button>
      <div class="flex items-center gap-4">
        <button onclick={() => go("/")} class="wow-mono text-[11px] text-white/60 hover:text-white">← Original</button>
        <button onclick={() => go("/wow")} class="wow-mono text-[11px] hover:text-[#ffb03a]">Work</button>
      </div>
    </div>
  </header>

  <main class="pt-[57px]">
    {#if slug}
      {#if valid}
        <ProjectWow {slug} />
      {:else}
        <div class="px-4 py-24 text-center md:px-10">
          <p class="wow-display text-[10vw]">No signal</p>
          <button class="wow-btn mt-6" onclick={() => go("/wow")}>Back to work</button>
        </div>
      {/if}
    {:else}
      <HomeWow />
    {/if}
  </main>

  <footer class="border-t border-white/10 px-4 py-8 md:px-10">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p class="wow-mono text-[11px] text-white/45">V1SU4 — wow variation · same content, new eye · <button class="underline hover:text-white" onclick={() => go("/")}>back to original</button></p>
      <div class="wow-beats w-full md:w-64" aria-hidden="true"></div>
    </div>
  </footer>
</div>
