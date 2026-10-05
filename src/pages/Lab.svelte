<script lang="ts">
  import { labItems } from "../data/projects";
  import { COL } from "../lib/router.svelte";
  import { stagger } from "../lib/stagger";
</script>

<!-- Centered like the menu's Work list, with the same entrance. -->
<div use:stagger class="{COL} flex min-h-[70svh] flex-col items-center justify-center gap-10 py-10 text-center">
  <p class="font-mono text-[15px] font-bold uppercase tracking-[0.03em]">Lab <span>‘In development’</span></p>
  {#each labItems as l (l.slug)}
    <div class="max-w-[46ch]">
      <h2 class="font-mono text-[14px] font-bold uppercase tracking-[0.03em]">{l.title} <span class="font-medium opacity-80">‘{l.kind}’</span></h2>
      <p class="mt-2 font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/70">{l.body}</p>
      <p class="mt-2 font-mono text-[11.5px] uppercase"><span class="font-medium text-accent/55">Status:</span> <span class="font-bold">{l.status}</span></p>
    </div>
  {/each}
</div>
