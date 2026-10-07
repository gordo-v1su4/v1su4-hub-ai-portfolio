import { useLayoutEffect, useRef, type DependencyList } from "react";
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * Coordinated entrance for everything marked [data-reveal] inside a page.
 * Runs on layout so there is no flash of un-animated content, and is replaced
 * by an instant "set to final state" when the visitor prefers reduced motion.
 */
export function useReveal<T extends HTMLElement>(deps: DependencyList = []) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll("[data-reveal]")) as HTMLElement[];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 18 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: EASE,
        stagger: 0.05,
        overwrite: "auto",
        delay: 0.03,
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/** Scroll-linked reveal for long case-study sections. Cheap: transform + opacity, fires once. */
export function useScrollReveal<T extends HTMLElement>(deps: DependencyList = []) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll("[data-scroll-reveal]")) as HTMLElement[];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 24 });

      // Anything already on screen reveals immediately; the rest waits for scroll.
      const line = window.innerHeight * 0.9;
      const now = targets.filter((t) => t.getBoundingClientRect().top < line);
      const later = targets.filter((t) => !now.includes(t));

      if (now.length) {
        gsap.to(now, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: EASE,
          stagger: 0.05,
          overwrite: "auto",
          delay: 0.03,
        });
      }
      if (later.length) {
        ScrollTrigger.batch(later, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: EASE,
              stagger: 0.06,
              overwrite: "auto",
            }),
        });
      }
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
