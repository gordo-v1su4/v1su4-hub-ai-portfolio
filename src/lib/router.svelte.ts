import { tick } from "svelte";
export type Route = { view: "home" | "lab" | "lab-project" | "about" | "archives" | "project" | "wow" | "wow-project"; slug?: string };

function parseHash(): Route {
  const h = window.location.hash.replace(/^#/, "") || "/";
  const lab = h.match(/^\/lab\/([\w-]+)/);
  if (lab) return { view: "lab-project", slug: lab[1] };
  if (h === "/lab") return { view: "lab" };
  if (h.startsWith("/wow/work/")) {
    const m = h.match(/^\/wow\/work\/([\w-]+)/);
    if (m) return { view: "wow-project", slug: m[1] };
  }
  if (h.startsWith("/wow")) return { view: "wow" };
  if (h.startsWith("/about")) return { view: "about" };
  if (h.startsWith("/archives")) return { view: "archives" };
  const m = h.match(/^\/(?:work|project)\/([\w-]+)/);
  if (m) return { view: "project", slug: m[1] };
  return { view: "home" };
}

export const router = $state<{ route: Route }>({ route: parseHash() });

const positions = new Map<string, number>();
let previousPath = window.location.hash || "#/";
let navigation = 0;
window.addEventListener("hashchange", async () => {
  const request = ++navigation;
  positions.set(previousPath, window.scrollY);
  previousPath = window.location.hash || "#/";
  router.route = parseHash();
  await tick();
  if (request !== navigation) return;
  window.scrollTo({top: positions.get(previousPath) ?? 0, behavior: "instant"});
});

/* In-site navigation. Each move adds a history entry, so the browser's back button and [BACK] both work. */
let inSiteMoves = 0;
export function go(path: string) {
  inSiteMoves += 1;
  window.location.hash = path;
}
export function back() {
  if (inSiteMoves > 0) { inSiteMoves -= 1; window.history.back(); }
  else { window.location.hash = "/"; window.scrollTo(0, 0); }
}

export const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const COL = "mx-auto w-full max-w-[520px] px-4";
