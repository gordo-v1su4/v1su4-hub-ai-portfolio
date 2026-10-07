import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Motion tokens. Short on purpose: nothing here should ever hold up a click. */
export const EASE = "power3.out";
export const EASE_IO = "power2.inOut";
export const D = {
  tap: 0.12,
  fast: 0.24,
  base: 0.42,
  slow: 0.7,
};

const QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useMedia(query: string, initial = false): boolean {
  // Read the real value on first render so the correct layout paints immediately.
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return initial;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export const DESKTOP = "(min-width: 1024px)";

/**
 * Entrance helper. When motion is reduced we simply place the elements in their
 * final state — no waiting, no movement.
 */
export function animateIn(
  els: Element[] | NodeListOf<Element> | null,
  vars: gsap.TweenVars,
  reduced: boolean,
  from: gsap.TweenVars = { opacity: 0, y: 14 }
) {
  if (!els) return;
  const list = Array.from(els as NodeListOf<Element>);
  if (list.length === 0) return;
  if (reduced) {
    gsap.set(list, { ...from, clearProps: "transform,opacity" });
    gsap.set(list, { opacity: 1 });
    return;
  }
  gsap.fromTo(list, from, { opacity: 1, y: 0, x: 0, duration: D.base, ease: EASE, ...vars });
}

/** Small, always-interruptible tap feedback for buttons and rows. */
export function press(scope: HTMLElement) {
  if (prefersReducedMotion()) return;
  gsap.killTweensOf(scope);
  gsap.fromTo(scope, { scale: 0.985 }, { scale: 1, duration: 0.26, ease: "elastic.out(1, 0.6)" });
}
