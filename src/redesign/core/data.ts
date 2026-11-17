import { site, softwareGroups } from "../../data/projects";
import { lab, work, type Entry } from "../../variations/editorial/data";

export { site, softwareGroups };
export type { Entry };

const BASE = import.meta.env.BASE_URL;
/** Resolve a public asset against the build's base, so the pages work at any path. */
export const asset = (p: string) => BASE + p.replace(/^\//, "");

/** Screen captures. The review build (VITE_PREVIEW) serves lighter copies from /images/pv. */
export const capture = (p: string) =>
  import.meta.env.VITE_PREVIEW
    ? asset(p.replace(/^\/images\//, "/images/pv/").replace(/\.(png|jpe?g|webp)$/, ".webp"))
    : asset(p);

export const esc = (s: string) =>
  (s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
export const nice = (s: string) =>
  s.toLowerCase().replace(/(^|[\s/&·-])(\w)/g, (_, a: string, b: string) => a + b.toUpperCase());

export interface Shot {
  kind: "title" | "project" | "about";
  slug: string;
  title: string;
  category: string;
  line: string;
  year?: string;
  status?: string;
  /** Cinematic plate, its depth map and a small thumbnail (see scripts/build-redesign-plates.py). */
  plate: string;
  depth: string;
  thumb: string;
  /** Optional looping teaser (muted). When set, directions that support video play it instead of the still. */
  video?: string;
  /** Point of interest in the plate, 0–1 from the top left. Cover crops stay centred on it. */
  focus: [number, number];
  entry?: Entry;
}

const FOCUS: Record<string, [number, number]> = {
  title: [0.5, 0.6],
  "video-haven": [0.5, 0.46],
  "review-room": [0.43, 0.55],
  pindeck: [0.5, 0.5],
  "beatsmaxxer-pro": [0.5, 0.55],
  "trailer-feed": [0.44, 0.46],
  "project-stack-structure": [0.58, 0.5],
  "gods-gatekeepers": [0.5, 0.4],
  "frame-lab": [0.5, 0.5],
  "creative-studio-pro": [0.5, 0.5],
  "music-video-agent": [0.56, 0.5],
  about: [0.5, 0.6],
};

/**
 * Teaser clips, keyed by project slug. Drop a short muted MP4 (H.264, ~1080p, a few MB)
 * into public/video/ and list it here, e.g. "video-haven": "/video/video-haven.mp4".
 */
const VIDEOS: Record<string, string> = {};

const plate = (slug: string) => ({
  video: VIDEOS[slug] ? asset(VIDEOS[slug]) : undefined,
  plate: asset(`/images/redesign/${slug}.webp`),
  depth: asset(`/images/redesign/${slug}-depth.jpg`),
  thumb: asset(`/images/redesign/${slug}-thumb.webp`),
  focus: FOCUS[slug] ?? ([0.5, 0.5] as [number, number]),
});

export const projects: Shot[] = [...work, ...lab].map((e) => ({
  kind: "project",
  slug: e.slug,
  title: nice(e.title),
  category: nice(e.category),
  line: e.line,
  year: e.year,
  status: nice(e.status),
  entry: e,
  ...plate(e.slug),
}));

export const titleShot: Shot = {
  kind: "title",
  slug: "title",
  title: site.label,
  category: site.role,
  line: site.mission,
  ...plate("title"),
};

export const aboutShot: Shot = {
  kind: "about",
  slug: "about",
  title: site.name,
  category: site.role,
  line: `${site.role.replace(" / ", " and ")}, working between ${site.base.replace(" / ", " and ")}.`,
  ...plate("about"),
};

const LINK_NAMES: Record<string, string> = {
  IMDB: "IMDb",
  GITHUB: "GitHub",
  LINKEDIN: "LinkedIn",
  INSTAGRAM: "Instagram",
  MIDJOURNEY: "Midjourney",
  "VFX REEL": "VFX reel",
};
export const links = site.links.map((l) => ({ href: l.href, label: LINK_NAMES[l.label] ?? nice(l.label) }));

/** "Series breakdown, 2026. In development." */
export const metaLine = (s: Shot) =>
  s.kind === "project"
    ? `${s.category}, ${s.year}. ${s.status![0] + s.status!.slice(1).toLowerCase()}.`
    : s.category;

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
