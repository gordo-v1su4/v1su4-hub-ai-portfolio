<script lang="ts">
  import Frame from './Frame.svelte';
  let { images, title }: { images: string[]; title: string } = $props();
  let current = $state(0);
  const selected = $derived(current % images.length);
  function advance(direction: number) {
    current = (selected + direction + images.length) % images.length;
  }
</script>

<div class="relative" role="region" aria-label={`${title} images`} aria-roledescription="carousel">
  <Frame src={images[selected]} alt={`${title} — ${selected === 0 ? 'benchmark results' : 'playback view'}`} eager natural cropSides={selected === 0 ? 0.2 : 0} monochrome={selected !== 0} />
  <button class="image-arrow previous" aria-label="Previous image" onclick={() => advance(-1)}>←</button>
  <button class="image-arrow next" aria-label="Next image" onclick={() => advance(1)}>→</button>
</div>
<p class="label mt-3 text-zinc-500" aria-live="polite">{selected + 1} / {images.length} — {selected === 0 ? 'Benchmark results' : 'Playback view'}</p>

<style>
  .image-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 44px; height: 44px; border: 1px solid #525252;
    background: #171717e6; color: #d4d4d8; cursor: pointer;
    font-size: 20px; display: grid; place-items: center;
  }
  .previous { left: 8px; }
  .next { right: 8px; }
  .image-arrow:hover { background: #303030; }
  .image-arrow:focus-visible { outline: 2px solid #d4d4d8; outline-offset: 3px; }
</style>
