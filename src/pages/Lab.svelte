<script lang="ts">
  import { labItems } from "../data/projects";
  import Caption from "../lib/Caption.svelte";
  import { COL } from "../lib/router.svelte";
</script>

<div class="{COL} pt-2">
  <Caption name="Lab" sub="In development" align="left" size="lg" />
  {#each labItems as l (l.slug)}
    <div class="mt-10">
      <h2 class="font-mono text-[14px] font-bold uppercase tracking-[0.03em]">{l.title} <span>‘{l.kind}’</span></h2>
      <p class="mt-2 font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/70">{l.body}</p>
      <p class="mt-2 font-mono text-[11.5px] uppercase"><span class="font-medium text-accent/55">Status:</span> <span class="font-bold">{l.status}</span></p>
    </div>
  {/each}
</div>
