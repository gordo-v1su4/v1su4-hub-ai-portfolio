<script lang="ts">
  import { site } from "../data/projects";
  import { COL, back, go } from "./router.svelte";

  let { onmenu, showBack }: { onmenu: () => void; showBack: boolean } = $props();
</script>

<header class="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/25 backdrop-blur-xl backdrop-saturate-150">
  <div class="{COL} flex items-center justify-between py-4">
    <button onclick={() => go("/")} class="select-none leading-none" aria-label="{site.name}, home">
      <span class="font-display text-[1.9rem] font-semibold uppercase leading-none tracking-[-0.03em] text-accent">{site.name}</span>
    </button>
    <div class="flex items-center gap-4 font-mono text-[13px] font-medium tracking-[0.06em] text-accent">
      {#if showBack}<button onclick={back}>[BACK]</button>{/if}
      <button onclick={onmenu}>[MENU]</button>
    </div>
  </div>
</header>
