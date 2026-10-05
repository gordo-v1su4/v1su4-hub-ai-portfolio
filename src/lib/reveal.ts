import { gsap } from "./gsap";
import { reduceMotion } from "./router.svelte";

/* Svelte action: fade an element up the first time it scrolls into view. */
export function reveal(node: HTMLElement) {
  if (reduceMotion()) return;
  const t = gsap.fromTo(node, { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: node, start: "top 92%" },
  });
  return { destroy() { t.scrollTrigger?.kill(); t.kill(); } };
}
