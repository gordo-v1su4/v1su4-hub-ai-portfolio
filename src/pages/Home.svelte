<script lang="ts">
  import { projects } from "../data/projects";
  import Caption from "../lib/Caption.svelte";
  import Still from "../lib/Still.svelte";
  import { reveal } from "../lib/reveal";
  import { COL, go } from "../lib/router.svelte";
</script>

<div class="{COL} flex flex-col gap-10 pt-2">
  {#each projects as p (p.slug)}
    <button use:reveal onclick={() => go(`/work/${p.slug}`)} class="group block w-full text-left" aria-label="{p.title}, {p.type}">
      <Still src={p.cover} fit={p.imageFit} />
      <Caption name={p.title} sub={p.type} />
    </button>
  {/each}
</div>
