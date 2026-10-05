<script lang="ts">
  /* Rounded still. The image shows in full: no scroll drift, no extra crop. */
  let { src, on = false, class: cls = "still aspect-[4/3]" }: { src: string; on?: boolean; class?: string } = $props();
</script>

<div class="relative overflow-hidden {cls}">
  <img {src} alt="" loading="lazy" class="still-img absolute inset-0 h-full w-full object-cover" class:is-on={on} />
</div>
