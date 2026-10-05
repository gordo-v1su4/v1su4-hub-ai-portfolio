<script lang="ts">
  let { n }: { n: number } = $props();
</script>

<div class="flex aspect-[16/10] items-center justify-center rounded-[0.85rem] border border-dashed border-accent/30 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent/45">
  Media {String(n).padStart(2, "0")} · add a screenshot or clip
</div>
