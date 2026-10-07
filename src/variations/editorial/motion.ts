import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export { gsap };
export const EASE = 'power3.out';
export const EASE_IO = 'power2.inOut';
export const D = { tap: 0.12, fast: 0.24, base: 0.42, slow: 0.7 };
export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export function press(e: PointerEvent) {
  if (reduced()) return;
  const el = e.currentTarget as HTMLElement;
  gsap.killTweensOf(el);
  gsap.fromTo(el, { scale: 0.985 }, { scale: 1, duration: 0.26, ease: 'elastic.out(1, 0.6)' });
}
export function reveal(node: HTMLElement, scroll = false) {
  const mm = gsap.matchMedia();
  mm.add({ reduced: '(prefers-reduced-motion: reduce)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
    const targets = [...node.querySelectorAll(scroll ? '[data-scroll-reveal]' : '[data-reveal]')];
    if (!targets.length) return;
    if (context.conditions?.reduced) { gsap.set(targets, { opacity: 1, y: 0 }); return; }
    gsap.set(targets, { opacity: 0, y: scroll ? 24 : 18 });
    if (!scroll) {
      gsap.to(targets, { opacity: 1, y: 0, duration: 0.55, ease: EASE, stagger: 0.05, overwrite: 'auto', delay: 0.03 });
    } else {
      const now = targets.filter(t => t.getBoundingClientRect().top < window.innerHeight * 0.9);
      const later = targets.filter(t => !now.includes(t));
      if (now.length) gsap.to(now, { opacity: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.05, overwrite: 'auto', delay: 0.03 });
      if (later.length) ScrollTrigger.batch(later, { start: 'top 90%', once: true,
        onEnter: batch => { gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.06, overwrite: 'auto' }); } });
    }
  }, node);
  return { destroy: () => mm.revert() };
}

/** Scroll depth is separate from the entrance so their transforms never compete. */
export function depth(node: HTMLElement) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(node, {transformPerspective: 1200, rotateX: 7, y: 24, scale: 0.98, transformOrigin: '50% 50%'},
      {rotateX: -3, y: -18, scale: 1, ease: 'none',
        scrollTrigger: {trigger: node, start: 'top bottom', end: 'bottom top', scrub: 0.65, invalidateOnRefresh: true}});
  }, node);
  return {destroy: () => mm.revert()};
}
