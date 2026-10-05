import { gsap } from "./gsap";
import { reduceMotion } from "./router.svelte";

/* Svelte action: children rise in one after another, the same entrance as the menu's Work list. */
export function stagger(node: HTMLElement) {
  if (reduceMotion()) return;
  const t = gsap.fromTo(node.children, { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: "power3.out" });
  return { destroy() { t.kill(); } };
}
