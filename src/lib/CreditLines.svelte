<script lang="ts">
  let { rows }: { rows: [string, string][] } = $props();
</script>

<div class="font-mono text-[11.5px] uppercase leading-[1.55] tracking-[0.01em]">
  {#each rows as [k, v] (k)}
    <p><span class="font-medium text-accent/55">{k}:</span> <span class="font-bold text-accent">{v}</span></p>
  {/each}
</div>
