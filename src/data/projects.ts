export type ProjectStatus = "Live" | "Beta" | "In Development" | "Coming Soon" | "Demo on Request";
export type Group = "featured" | "more";

export interface Project {
  slug: string;
  title: string;
  type: string;
  group: Group;
  tagline: string;
  role: string;
  status: ProjectStatus;
  year: string;
  stack: string[];
  // Placeholder stills from the Arena draft. Replace each with a real screenshot or capture of the project.
  cover: string;
  link?: string;
  what: string;
  flow: { label: string; sub: string }[];
  // Show "How it works" as a pinned horizontal slide section on the project page.
  horizontal?: boolean;
  // Screenshots or clips for the case-study page (files in public/images/). Empty slots show until added.
  media?: string[];
}

export const projects: Project[] = [
  {
    slug: "beatsmaxxer-pro",
    title: "BEATSMAXXER PRO",
    group: "featured",
    horizontal: true,
    type: "Audio-Reactive Editor",
    tagline: "Audio-reactive video FX rack for live visuals and music videos.",
    role: "Design / Development",
    status: "Live",
    year: "2026",
    stack: ["SvelteKit", "WebGPU", "Essentia", "Tauri"],
    cover: "/images/beats.jpg",
    link: "https://beatsmaxxing.com",
    what: "Eight clip slots, a program monitor that cuts on the beat, and 19 WebGPU shader effects. Song sections land on a timeline; ramps, stutters and jump cuts lock to the beat grid. Runs in the browser, on phones, and as a Windows app.",
    flow: [
      { label: "TRACK", sub: "Song in" },
      { label: "ANALYSIS", sub: "Beats · sections · tempo" },
      { label: "RACK", sub: "8 clips · 19 shader FX" },
      { label: "PERFORM", sub: "Beat-locked cuts · MIDI" },
      { label: "OUTPUT", sub: "Browser · phone · desktop" },
    ],
  },
  {
    slug: "pindeck",
    title: "PINDECK",
    group: "featured",
    horizontal: true,
    type: "AI Image Curation",
    tagline: "From scattered AI images to storyboards and pitch decks.",
    role: "Design / Development",
    status: "Live",
    year: "2025",
    stack: ["React", "Convex", "Trigger.dev", "RustFS"],
    cover: "/images/pindeck.jpg",
    link: "https://pindeck.dev",
    what: "One workspace for image curation. Images come in from Discord, Pinterest or upload, get tagged and color-analyzed automatically, branch into AI variations with full lineage, and end up on boards, storyboards and pitch decks.",
    flow: [
      { label: "INGEST", sub: "Discord · Pinterest · upload" },
      { label: "ANALYZE", sub: "Auto tags · palette · sref" },
      { label: "VARY", sub: "AI variations with lineage" },
      { label: "CURATE", sub: "Boards" },
      { label: "OUTPUT", sub: "Storyboards · pitch decks" },
    ],
  },
  {
    slug: "frame-lab",
    title: "FRAME LAB",
    group: "more",
    type: "Playback Benchmark",
    tagline: "Which browser playback strategy shows the right frame on the beat?",
    role: "Research / Development",
    status: "Live",
    year: "2026",
    stack: ["TypeScript", "WebCodecs", "WebGPU"],
    cover: "/images/chroma.jpg",
    link: "https://frame-lab-gamma.vercel.app/benchmark",
    what: "A public benchmark comparing HTML video pools, WebCodecs frame caches and preloaded WebGPU textures under musical cuts, seeks, stutters and speed ramps. Built to choose the playback engine for beat-synced editing.",
    flow: [
      { label: "CLIPS", sub: "Multi-clip workload" },
      { label: "STRATEGIES", sub: "Video pool · WebCodecs · GPU" },
      { label: "STRESS", sub: "Cuts · seeks · ramps" },
      { label: "OUTPUT", sub: "Recorded frame timing" },
    ],
  },
  {
    slug: "project-stack-structure",
    title: "PROJECT STACK STRUCTURE",
    group: "more",
    horizontal: true,
    type: "Music-Video Studio",
    tagline: "Upload a song and your clips, get a beat-aligned cut.",
    role: "Design / Development",
    status: "Beta",
    year: "2026",
    stack: ["Next.js", "Trigger.dev", "Essentia", "ComfyUI"],
    cover: "/images/cinema.jpg",
    what: "Real footage drives the edit. The song is analyzed for beats and sections, clips are scene-detected and captioned, moments are matched to the story, and AI generation fills only the gaps, using cloud models or local ComfyUI.",
    flow: [
      { label: "ANALYZE", sub: "Beats · sections" },
      { label: "INGEST", sub: "Scene detect · captions" },
      { label: "MATCH", sub: "Clips to sections" },
      { label: "GAP-FILL", sub: "Cloud or local AI" },
      { label: "OUTPUT", sub: "Preview · export" },
    ],
  },
  {
    slug: "review-room",
    title: "REVIEW ROOM",
    group: "more",
    type: "Review & Dailies",
    tagline: "Production review and dailies, on my own storage.",
    role: "Design / Development",
    status: "Demo on Request",
    year: "2026",
    stack: ["Svelte", "Convex", "RustFS", "Trigger.dev"],
    cover: "/images/api.jpg",
    what: "Client and studio logins, projects and folders, daily playlists, per-artist review, hover-scrub previews, comments, ratings and notifications. Used in production with studios and clients.",
    flow: [
      { label: "UPLOAD", sub: "Shots into projects" },
      { label: "PLAYLIST", sub: "Dailies per artist" },
      { label: "REVIEW", sub: "Scrub · comment · rate" },
      { label: "NOTIFY", sub: "Inbox · notifications" },
    ],
  },
  {
    slug: "v1su4-format",
    title: "V1SU4 FORMAT",
    group: "more",
    type: "Concept Visuals",
    tagline: "Concept worlds for live shows.",
    role: "Concept / 3D / AI",
    status: "Coming Soon",
    year: "2026",
    stack: ["Houdini", "Unreal Engine", "ComfyUI"],
    cover: "/images/hero-eye.jpg",
    what: "A series of themed visual worlds for live shows, each broken down from concept film to LED loop, 3D and AI passes, and music sync.",
    flow: [
      { label: "CONCEPT", sub: "Concept film" },
      { label: "CONTENT", sub: "LED / projection loop" },
      { label: "BREAKDOWN", sub: "3D + AI passes" },
      { label: "SYNC", sub: "Music-locked" },
    ],
  },
];

export interface LabItem {
  slug: string;
  title: string;
  kind: string;
  body: string;
  status: string;
}

export const labItems: LabItem[] = [
  {
    slug: "trailer-feed",
    title: "TRAILER FEED",
    kind: "AI TRAILER STUDIO",
    body: "A canvas-first studio for AI short films and trailers: story beats on a board, generated takes on each beat, and cuts you trim and finish. Generation runs only after approval and a cost check.",
    status: "In development",
  },
  {
    slug: "music-video-agent",
    title: "MUSIC VIDEO AGENT",
    kind: "AGENTIC · LOCAL",
    body: "Takes you from no idea to a developed concept: asks for ideas, writes three loglines, expands them into short pitches, makes a quick concept video, then breaks the story into beats. Runs fully local.",
    status: "In development",
  },
];

export const skillGroups = [
  { title: "GENERATIVE AI", items: ["ComfyUI", "LoRA training", "Image", "Video", "Audio"] },
  { title: "3D / VFX", items: ["Houdini", "Unreal Engine", "Nuke"] },
  { title: "WEB", items: ["TypeScript", "Svelte", "React", "WebGPU"] },
  { title: "BACKEND", items: ["Python", "Rust", "Convex", "Trigger.dev", "Docker"] },
];

export const site = {
  name: "Gordo",
  label: "V1SU4",
  role: "Creative Technologist",
  focus: "Generative AI for commercials, TV & live shows",
  base: "Miami",
  // TODO: add a contact email before publishing.
  email: "",
  links: [
    { label: "GITHUB", href: "https://github.com/gordo-v1su4" },
    { label: "LINKEDIN", href: "https://www.linkedin.com/in/gordo-spaniolo/" },
    { label: "INSTAGRAM", href: "https://www.instagram.com/shotbyspaniolo" },
    { label: "IMDB", href: "https://www.imdb.com/name/nm6667790/" },
    { label: "VFX REEL", href: "https://vimeo.com/328351564" },
  ],
};
