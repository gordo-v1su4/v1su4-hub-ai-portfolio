<script lang="ts">
  import Frame from './Frame.svelte';
  let {
    images,
    title,
    monochromeSlides = false,
    coverHero = false,
    standardFrame = false,
  }: { images: string[]; title: string; monochromeSlides?: boolean; coverHero?: boolean; standardFrame?: boolean } = $props();
  let current = $state(0);
  const selected = $derived(current % images.length);
  function advance(direction: number) {
    current = (selected + direction + images.length) % images.length;
  }
</script>

<div class="image-viewer" class:standard-frame={standardFrame} role="region" aria-label={`${title} images`} aria-roledescription="carousel">
  <div class="image-stage">
    <Frame
      src={images[selected]}
      alt={`${title} — image ${selected + 1}`}
      eager
      heroCover={coverHero && selected === 0}
      natural={!standardFrame && !(coverHero && selected === 0)}
      monochrome={monochromeSlides && selected !== 0}
    />
  </div>
  <button class="image-arrow previous" aria-label="Previous image" onclick={() => advance(-1)}><span aria-hidden="true"></span></button>
  <button class="image-arrow next" aria-label="Next image" onclick={() => advance(1)}><span aria-hidden="true"></span></button>
</div>
<p class="label mt-3 text-zinc-500" aria-live="polite">{selected + 1} / {images.length}</p>

<style>
  .image-viewer { position: relative; aspect-ratio: 4 / 5; background: #0a0a0a; }
  @media (min-width: 640px) {
    .image-viewer { aspect-ratio: 1524 / 1300; }
  }
  .image-viewer.standard-frame { aspect-ratio: 16 / 10; }
  .image-stage { position: absolute; inset: 0; overflow: hidden; }
  .image-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 24px; height: 44px; border: 0;
    background: transparent; color: #a1a1aa; cursor: pointer;
    font-family: var(--font-mono); font-size: 16px; display: grid; place-items: center;
  }
  .previous { left: -24px; }
  .next { right: -24px; }
  .image-arrow span { width: 9px; height: 9px; border-top: 1px solid currentColor; border-right: 1px solid currentColor; }
  .previous span { transform: rotate(-135deg); }
  .next span { transform: rotate(45deg); }
  .image-arrow:hover { color: #d4d4d8; }
  .image-arrow:focus-visible { outline: 2px solid #d4d4d8; outline-offset: 3px; }
  @media (max-width: 639px) {
    .image-arrow { width: 16px; }
    .previous { left: -16px; }
    .next { right: -16px; }
  }
</style>
