<script lang="ts">
  /* Simple centered menu first; WORK opens the project list inside the menu, with a way back. */
  import { tick } from "svelte";
  import { projects } from "../data/projects";
  import { gsap } from "./gsap";
  import { COL, go, reduceMotion } from "./router.svelte";

  let { open, onclose, oncontact }: { open: boolean; onclose: () => void; oncontact: () => void } = $props();
  let level = $state<"main" | "work">("main");

  $effect(() => { if (open) level = "main"; });
  $effect(() => {
    if (!open || reduceMotion()) return;
    void level;
    tick().then(() => {
      gsap.fromTo(".menu-link", { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power3.out" });
    });
  });

  function onkeydown(e: KeyboardEvent) {
    if (!open || e.key !== "Escape") return;
    if (level === "work") level = "main"; else onclose();
  }
  const nav = (p: string) => () => { onclose(); go(p); };
  const big = "menu-link font-mono text-[22px] tracking-[0.22em] text-accent hover:opacity-70";
</script>

<svelte:window {onkeydown} />

{#if open}
  <div role="dialog" aria-modal="true" aria-label="Menu" class="no-scrollbar fixed inset-0 z-[80] overflow-y-auto bg-ink/95 backdrop-blur-sm">
    <div class="{COL} flex justify-end gap-4 py-4 font-mono text-[13px] font-medium tracking-[0.06em]">
      {#if level === "work"}<button onclick={() => (level = "main")}>[BACK]</button>{/if}
      <button onclick={onclose}>[CLOSE]</button>
    </div>
    {#if level === "main"}
      <nav class="flex min-h-[70svh] flex-col items-center justify-center gap-6">
        <button onclick={() => (level = "work")} class={big}>WORK</button>
        <button onclick={nav("/lab")} class={big}>LAB</button>
        <button onclick={nav("/about")} class={big}>ABOUT</button>
        <button onclick={() => { onclose(); oncontact(); }} class={big}>CONTACT</button>
      </nav>
    {:else}
      <nav class="flex min-h-[70svh] flex-col items-center justify-center gap-4 px-4 text-center">
        {#each projects as p (p.slug)}
          <button onclick={nav(`/work/${p.slug}`)} class="menu-link font-mono text-[14px] font-semibold uppercase tracking-[0.04em] text-accent hover:opacity-70">
            {p.title} <span class="font-medium opacity-80">‘{p.type}’</span>
          </button>
        {/each}
      </nav>
    {/if}
  </div>
{/if}
