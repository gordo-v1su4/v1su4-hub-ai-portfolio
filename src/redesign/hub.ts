// Review shell: mounts one redesign direction at a time and switches between them.
// Used by /redesign so the directions can be compared side by side.
import "./hub.css";

type Mount = (root: HTMLElement) => () => void;
const DIRECTIONS: Record<string, { label: string; load: () => Promise<{ mount: Mount }> }> = {
  sim: { label: "Sim", load: () => import("./sim/index") },
  scope: { label: "Scope", load: () => import("./scope/index") },
  slit: { label: "Slit", load: () => import("./slit/index") },
};

const app = document.getElementById("app")!;
const bar = document.createElement("nav");
bar.className = "hub-bar";
bar.setAttribute("aria-label", "Redesign directions");
bar.innerHTML = Object.entries(DIRECTIONS)
  .map(([key, d]) => `<a href="#${key}" data-key="${key}">${d.label}</a>`)
  .join("");
document.body.append(bar);

let dispose: (() => void) | null = null;
let token = 0;
async function show() {
  const key = location.hash.slice(1) in DIRECTIONS ? location.hash.slice(1) : Object.keys(DIRECTIONS)[0];
  const mine = ++token;
  bar.querySelectorAll("a").forEach((a) => a.toggleAttribute("aria-current", a.dataset.key === key));
  const mod = await DIRECTIONS[key].load();
  if (mine !== token) return;
  dispose?.();
  window.scrollTo(0, 0);
  dispose = mod.mount(app);
}
window.addEventListener("hashchange", show);
void show();
