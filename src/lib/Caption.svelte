<script lang="ts">
  let { name, sub, align = "center", size = "sm" }: { name: string; sub: string; align?: "center" | "left"; size?: "sm" | "lg" } = $props();
</script>

<p class="mt-3 font-mono font-semibold uppercase tracking-[0.03em] text-accent {align === 'center' ? 'text-center' : ''} {size === 'lg' ? 'text-[15px]' : 'text-[13px]'}">
  {name} <span>‘{sub}’</span>
</p>
