<script lang="ts">
  /* Rounded still with slow scroll parallax on the image inside. */
  import { onMount } from "svelte";
  import { gsap } from "./gsap";
  import { reduceMotion } from "./router.svelte";

  let { src, on = false, class: cls = "still aspect-[4/3]" }: { src: string; on?: boolean; class?: string } = $props();
  let box: HTMLDivElement;
  let img: HTMLImageElement;

  onMount(() => {
    if (reduceMotion()) return;
    const t = gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  });
</script>

<div bind:this={box} class="relative overflow-hidden {cls}">
  <img bind:this={img} {src} alt="" loading="lazy" class="still-img absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" class:is-on={on} />
</div>
