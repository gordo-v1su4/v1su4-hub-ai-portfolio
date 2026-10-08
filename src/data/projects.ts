export type ProjectStatus = "Live" | "Beta" | "In Development" | "Coming Soon" | "Demo on Request";
export type Group = "featured" | "more";

export interface Project {
  slug: string;
  title: string;
  type: string;
  group: Group;
  tagline: string;
  rationale?: string;
  role: string;
  status: ProjectStatus;
  year: string;
  stack: string[];
  stackGroups?: { title: string; items: string[] }[];
  // Placeholder stills from the Arena draft. Replace each with a real screenshot or capture of the project.
  cover: string;
  previewImage?: string;
  imageFit?: "cover" | "contain";
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
    slug: "video-haven",
    title: "VIDEO HAVEN",
    group: "featured",
    type: "Series Breakdown",
    tagline: "A series-specific home for the story, characters and production material.",
    rationale: "A series needs one place where its story, characters, world and working footage can be explored together. Video Haven brings that breakdown into a visual experience, with Blood Rush as the first featured series.",
    role: "Creative Direction / Production / Development",
    status: "In Development",
    year: "2026",
    stack: ["React", "TypeScript", "Vite", "GSAP", "Three.js"],
    stackGroups: [{ title: "Front end", items: ["React", "TypeScript", "Vite", "GSAP", "Three.js"] }, { title: "Back end", items: ["Static site · no server backend"] }, { title: "Production tasks", items: ["Series breakdown", "Interactive DVD collection", "Character auditions", "Storyboards and working previews"] }],
    cover: "/images/video-haven-centered.png",
    imageFit: "contain",
    what: "A show-specific series breakdown bringing together the story, characters, locations, storyboards and working footage. Blood Rush is the first series, presented through Video Haven’s interactive collection.",
    flow: [{ label: "SERIES", sub: "Explore the story and visual direction" }, { label: "COLLECTION", sub: "Browse working previews and development tests" }, { label: "WORLD", sub: "Meet the characters and explore locations" }, { label: "PRODUCTION", sub: "Follow storyboards and production development" }],
    media: [],
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
    stackGroups: [{ title: "Front end", items: ["Svelte"] }, { title: "Back end", items: ["Convex", "RustFS", "Trigger.dev"] }, { title: "Production tasks", items: ["Project media and daily playlists", "Shot review, comments and ratings", "Client notifications"] }],
    cover: "/images/review-room-main.webp",
    imageFit: "contain",
    link: "https://review.v1su4.dev",
    media: [],
    what: "Client and studio logins, projects and folders, daily playlists, per-artist review, hover-scrub previews, comments, ratings and notifications. Used in production with studios and clients.",
    flow: [
      { label: "UPLOAD", sub: "Shots into projects" },
      { label: "PLAYLIST", sub: "Dailies per artist" },
      { label: "REVIEW", sub: "Scrub · comment · rate" },
      { label: "NOTIFY", sub: "Inbox · notifications" },
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
    stackGroups: [{ title: "Front end", items: ["React"] }, { title: "Back end", items: ["Convex", "Trigger.dev", "RustFS"] }, { title: "Production tasks", items: ["Image ingestion and analysis", "AI variations and lineage", "Boards, storyboards and pitch decks"] }],
    cover: "/images/pindeck-workspace.png",
    imageFit: "contain",
    link: "https://www.pindeck.dev",
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
    stackGroups: [{ title: "Front end", items: ["SvelteKit", "WebGPU", "Tauri desktop shell"] }, { title: "Back end", items: ["Essentia audio analysis"] }, { title: "Production tasks", items: ["Audio-reactive editing", "Shader FX rack", "Performance and export"] }],
    cover: "/images/beatsmaxxer-workspace.png",
    imageFit: "contain",
    link: "https://www.beatsmaxxing.com",
    what: "Eight clip slots, a program monitor that cuts on the beat, and 19 WebGPU shader effects. Song sections land on a timeline; ramps, stutters and jump cuts lock to the beat grid. Runs in the browser, on phones, and as a Windows app.",
    flow: [
      { label: "ANALYSIS", sub: "Beats · sections · tempo" },
      { label: "AUDIO-REACTIVE EDIT", sub: "Cuts · ramps · stutters locked to the beat grid" },
      { label: "RACK", sub: "8 clips · 19 shader FX" },
      { label: "PERFORM / EXPORT", sub: "Beat-locked cuts · MIDI · browser · phone · desktop" },
    ],
  },
  {
    slug: "frame-lab",
    title: "FRAME LAB",
    group: "more",
    type: "Playback Benchmark",
    tagline: "Which browser playback strategy shows the right frame on the beat?",
    rationale: "Beat-synced editing needs the right frame to appear on time, even across multiple videos, rapid cuts and speed changes. I needed to find out which browser playback approach could actually keep up, so I built a benchmark to compare timing, reliability and memory use on the same workloads.",
    role: "Research / Development",
    status: "Live",
    year: "2026",
    stack: ["TypeScript", "WebCodecs / Mediabunny", "WebGPU", "HTML video pool", "libmedia · experimental probe", "FFmpeg · media preparation & recording"],
    stackGroups: [
      { title: "Front end", items: ["TypeScript", "HTML video pool", "WebCodecs / Mediabunny", "WebGPU", "libmedia · experimental probe"] },
      { title: "Back end", items: ["No server backend", "IndexedDB · browser-local results"] },
      { title: "Production tasks", items: ["FFmpeg · media preparation & recording", "Playback stress tests", "Timing, reliability and memory reports"] },
    ],
    cover: "/images/frame-lab-results.png",
    previewImage: "/images/frame-lab-results.png",
    imageFit: "contain",
    media: ["/images/frame-lab-playback.png"],
    link: "https://frame-lab-gamma.vercel.app/benchmark",
    what: "A public benchmark comparing HTML video pools, Mediabunny / WebCodecs frame caches and preloaded WebGPU textures under musical cuts, seeks, stutters and speed ramps. libmedia is included as an experimental capability probe; FFmpeg prepares fixture media and demo recordings. Built to choose the playback engine for beat-synced editing.",
    flow: [
      { label: "CLIPS", sub: "FFmpeg-prepared multi-clip workload" },
      { label: "STRATEGIES", sub: "HTML video · Mediabunny / WebCodecs · GPU textures; libmedia capability probe" },
      { label: "STRESS", sub: "Cuts · seeks · ramps" },
      { label: "OUTPUT", sub: "Recorded frame timing" },
    ],
  },
  {
    slug: "trailer-feed",
    title: "TRAILER FEED",
    group: "more",
    type: "Video Portfolio",
    tagline: "Finished AI video projects, with every version, prompt and model kept together.",
    role: "Design / Development",
    status: "Live",
    year: "2026",
    stack: ["SvelteKit", "Python", "SQLite", "RustFS"],
    stackGroups: [{ title: "Front end", items: ["SvelteKit"] }, { title: "Back end", items: ["Python", "SQLite", "RustFS"] }, { title: "Production tasks", items: ["Finished project import", "Version playback and comparison", "Prompt and model reference library"] }],
    cover: "/images/trailer-feed-workspace.png",
    imageFit: "contain",
    link: "https://trailerfeed.video",
    what: "A video portfolio for importing finished projects, watching versions, comparing takes, and keeping prompts and model metadata alongside the videos. Prompts and sources are kept as a reference library.",
    flow: [
      { label: "IMPORT", sub: "Finished videos in" },
      { label: "VERSIONS", sub: "Play · compare takes" },
      { label: "METADATA", sub: "Prompt · model per cut" },
      { label: "LIBRARY", sub: "Prompts · sources" },
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
    stackGroups: [{ title: "Front end", items: ["Next.js"] }, { title: "Back end", items: ["Trigger.dev", "Essentia"] }, { title: "Production tasks", items: ["Scene detection and shot matching", "ComfyUI · AI gap generation", "Beat-aligned preview and export"] }],
    cover: "/images/project-stack-workspace.png",
    imageFit: "contain",
    link: "https://project-stack-structure.vercel.app",
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
    slug: "v1su4-format",
    title: "V1SU4 FORMAT",
    group: "more",
    type: "Concept Visuals",
    tagline: "Concept worlds for live shows.",
    role: "Concept / 3D / AI",
    status: "Coming Soon",
    year: "2026",
    stack: ["Houdini", "Unreal Engine", "ComfyUI"],
    stackGroups: [{ title: "Front end", items: ["Unreal Engine · realtime visuals"] }, { title: "Back end", items: ["No application backend"] }, { title: "Production tasks", items: ["Houdini · 3D passes", "ComfyUI · AI passes", "Concept films, LED loops and music sync"] }],
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
    slug: "creative-studio-pro",
    title: "CREATIVE STUDIO PRO",
    kind: "AI TRAILER STUDIO",
    body: "A canvas-first studio for AI short films and trailers: story beats on a board, generated takes on each beat, and cuts you trim and finish. Generation runs only after approval and a cost check.",
    status: "In development",
  },
  {
    slug: "music-video-agent",
    title: "MUSIC VIDEO AGENT",
    kind: "AGENTIC · LOCAL",
    body: "A music-video production workspace that analyzes a song, develops a treatment, and organizes the story and shot plan before generation.",
    status: "In development",
  },
];

export const skillGroups = [
  { title: "GENERATIVE AI", items: ["ComfyUI", "LoRA training", "Image", "Video", "Audio"] },
  { title: "3D / VFX", items: ["Houdini", "Unreal Engine", "Nuke", "After Effects"] },
  { title: "WEB", items: ["TypeScript", "Svelte", "React", "WebGPU"] },
  { title: "BACKEND", items: ["Python", "Rust", "Convex", "Trigger.dev", "Docker"] },
];

export const site = {
  name: "Gordo",
  label: "V1SU4",
  role: "Creative Technologist",
  focus: "Generative AI for commercials, TV & live shows",
  base: "Miami / LA",
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
