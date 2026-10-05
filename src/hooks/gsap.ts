import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function useGsapContext(cb: (ctx: gsap.Context) => void, deps: unknown[] = []) {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => cb(ctx), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}

export function splitChars(el: HTMLElement) {
  const text = el.textContent ?? "";
  el.setAttribute("aria-label", text);
  el.innerHTML = "";
  const frag = document.createDocumentFragment();
  [...text].forEach((ch) => {
    const s = document.createElement("span");
    s.className = "char";
    s.textContent = ch === " " ? "\u00A0" : ch;
    frag.appendChild(s);
  });
  el.appendChild(frag);
  return el.querySelectorAll(".char");
}

export function revealChars(el: HTMLElement | null, delay = 0) {
  if (!el) return;
  const chars = splitChars(el);
  gsap.fromTo(
    chars,
    { yPercent: 110, opacity: 0, rotateZ: 6 },
    {
      yPercent: 0,
      opacity: 1,
      rotateZ: 0,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.018,
      delay,
    }
  );
}

export function parallaxImg(img: HTMLElement | null, trigger: HTMLElement | null, amount = 18) {
  if (!img || !trigger) return;
  gsap.fromTo(
    img,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: "none",
      scrollTrigger: { trigger, scrub: 1.1, start: "top bottom", end: "bottom top" },
    }
  );
}

export function useMagnetic<T extends HTMLElement>(strength = 0.35): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);
  return ref;
}
