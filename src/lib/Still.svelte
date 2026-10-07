<script lang="ts">
  let { src, on = false, fit = "cover", class: cls }: { src: string; on?: boolean; fit?: "cover" | "contain"; class?: string } = $props();
  const natural = $derived(fit === "contain" && !cls);
</script>

<div class="relative overflow-hidden {cls ?? (natural ? 'still' : 'still aspect-[4/3]')}">
  <img {src} alt="" loading="lazy" class="still-img w-full {natural ? 'block h-auto' : 'absolute inset-0 h-full'}" style:object-fit={fit} class:is-on={on} />
</div>
