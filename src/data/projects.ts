export type ProjectStatus = "Live" | "Beta" | "In Development" | "Coming Soon" | "In Production";
export type Group = "featured" | "more";

export interface Project {
  slug: string;
  title: string;
  type: string;
  group: Group;
  tagline: string;
  /** Short series line under the title, e.g. “A V1SU4 format experience”. */
  format?: string;
  rationale: string;
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
  linkLabel?: string;
  what: string;
  flow: { label: string; sub: string }[];
  // Show "How it works" as a pinned horizontal slide section on the project page.
  horizontal?: boolean;
  // Screenshots or clips for the case-study page (files in public/images/). Empty slots show until added.
  media?: string[];
  // Optional thematic pillars for concept / worldbuilding projects.
  worlds?: { title: string; description: string }[];
}

/** Visual-format flagship — always last in portfolio index order. */
export const SPOTLIGHT_SLUG = "gods-gatekeepers";

export const projects: Project[] = [
  {
    slug: "video-haven",
    title: "VIDEO HAVEN",
    group: "featured",
    type: "Series Breakdown",
    tagline: "A series-specific home for the story, characters and production material.",
    rationale: "I wanted someone to be able to get to know a fictional world through both its finished imagery and the work taking shape behind it.",
    role: "Creative Direction / Production / Development",
    status: "In Development",
    year: "2026",
    stack: ["React", "TypeScript", "Vite", "GSAP", "Three.js"],
    stackGroups: [{ title: "Front end", items: ["React", "TypeScript", "Vite", "GSAP", "Three.js"] }, { title: "Back end", items: ["Static site · no server backend"] }, { title: "Production tasks", items: ["Series breakdown", "Interactive DVD collection", "Character auditions", "Storyboards and working previews"] }],
    cover: "/images/video-haven-centered.png",
    imageFit: "contain",
    link: "https://www.videohaven.stream/",
    what: "An interactive home for an original series, bringing its story, characters, locations, and production material together. I’m developing the creative presentation and building the experience, with Blood Rush as the first featured series.",
    flow: [{ label: "SERIES", sub: "Explore the story and visual direction" }, { label: "COLLECTION", sub: "Browse working previews and development tests" }, { label: "WORLD", sub: "Meet the characters and explore locations" }, { label: "PRODUCTION", sub: "Follow storyboards and production development" }],
    media: [],
  },
  {
    slug: "review-room",
    title: "REVIEW ROOM",
    group: "more",
    type: "Review & Dailies",
    tagline: "Production review and dailies, self-hosted.",
    role: "Design / Development",
    status: "In Production",
    rationale: "Keeping review close to the footage helps me follow a shot from upload through feedback without losing the conversation around it.",
    year: "2026",
    stack: ["Svelte", "Convex", "RustFS", "Trigger.dev"],
    stackGroups: [{ title: "Front end", items: ["Svelte"] }, { title: "Back end", items: ["Convex", "RustFS", "Trigger.dev"] }, { title: "Production tasks", items: ["Project media and daily playlists", "Shot review, comments and ratings", "Client notifications"] }],
    cover: "/images/captures/2026-10-17/review-room-cover-final.jpg",
    imageFit: "contain",
    link: "https://www.linkedin.com/in/gordo-spaniolo/",
    linkLabel: "Request a demo",
    media: ["/images/captures/2026-10-17/review-room-library-retake.jpg","/images/captures/2026-10-17/review-room-list.webp","/images/captures/2026-10-17/review-room-table.webp","/images/captures/2026-10-17/review-room-drawover.webp","/images/captures/2026-10-17/review-room-publishing.webp","/images/captures/2026-10-17/review-room-media-flow.webp","/images/captures/2026-10-17/review-room-metadata-model.webp"],
    what: "I designed and built Review Room to keep footage, dailies, and feedback together on infrastructure I control. It brings project organization, video review, comments, and playlists into one place. I use it in production, where finding a shot, reviewing it, and responding to notes matter as much as the interface.",
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
    what: "Pindeck grew out of needing a better way to work with a growing collection of AI images. I designed and built a workspace that keeps references, variations, and their origins together, then carries selected images into boards, storyboards, and pitch decks.",
    rationale: "I wanted a collection to help me develop a direction, beyond simply saving images for later.",
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
    what: "A video effects rack for making loaded footage move with music. I designed and built the app, combining audio analysis, beat-synced cuts, and real-time effects in a performance interface.",
    rationale: "I’m exploring how much of the timing can happen automatically while leaving room to choose the clips, shape the look, and perform.",
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
    rationale: "A repeatable test lets me choose a playback approach based on what actually happens on screen.",
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
    linkLabel: "Open benchmark",
    what: "When I started building beat-synced video tools, I needed to know which browser playback approaches could keep up. I built Frame Lab to compare them under cuts, seeks, stutters, and speed changes.",
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
    cover: "/images/captures/2026-10-17/trailer-feed-main.webp",
    media: ["/images/captures/2026-10-17/trailer-feed-selected.png","/images/captures/2026-10-17/trailer-feed-comparison.webp","/images/captures/2026-10-17/trailer-feed-home.webp","/images/captures/2026-10-17/trailer-feed-prompts.webp"],
    imageFit: "contain",
    link: "https://trailerfeed.video",
    what: "A home for finished AI video projects and the versions, prompts, and model details behind them. I designed and built it so I could watch the work, compare variations, and return to how a particular result was made.",
    rationale: "Keeping the creative output and its production history together gives me something I can return to and learn from.",
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
    what: "A music-video tool built around a song and footage you already have. I designed and built the workflow to analyze the music, find useful moments in the clips, and assemble a beat-aligned rough cut, with AI generation available for missing coverage.",
    rationale: "I’m exploring how software can help organize an edit while keeping the supplied footage central to the result.",
    flow: [
      { label: "ANALYZE", sub: "Beats · sections" },
      { label: "INGEST", sub: "Scene detect · captions" },
      { label: "MATCH", sub: "Clips to sections" },
      { label: "GAP-FILL", sub: "Cloud or local AI" },
      { label: "OUTPUT", sub: "Preview · export" },
    ],
  },
  {
    slug: "gods-gatekeepers",
    title: "GODS & GATEKEEPERS",
    link: "https://gods.v1su4.dev/",
    linkLabel: "Explore concept",
    group: "featured",
    horizontal: true,
    type: "Immersive Concert Visual Concept Series",
    format: "A V1SU4 format experience",
    tagline: "Ancient mythology, impossible scale, and worlds within worlds.",
    rationale:
      "The project asks how a stage might feel like an unfolding world, with depth and transformation becoming part of the experience.",
    role: "Creative Direction / Worldbuilding / 3D / AI / VFX / Previsualization",
    status: "In Development",
    year: "2026",
    stack: ["Maya", "Houdini", "ComfyUI", "Nuke", "After Effects"],
    stackGroups: [
      {
        title: "Concept",
        items: ["Concept art", "Art direction", "Story development", "World building"],
      },
      {
        title: "Visual development",
        items: ["3D modeling", "AI exploration", "Look development", "Previsualization", "Projection studies"],
      },
      {
        title: "Show delivery",
        items: ["LED content concepts", "Forced perspective", "Lighting synchronization", "Show visualization"],
      },
    ],
    cover: "/images/gods-gatekeepers-hero.jpg",
    previewImage: "/images/gods-gatekeepers-hero.jpg",
    what: "A personal concept series of imagined concert worlds built around mythology, impossible scale, and unexpected reveals. I’m developing the visual direction, worldbuilding, and sequences through 3D, AI, and VFX exploration.",
    flow: [
      {
        label: "CONCEPT & WORLD BUILDING",
        sub: "Original mythologies, environments, and reveal sequences—concept art, art direction, and story development",
      },
      {
        label: "3D, AI & VISUAL DEVELOPMENT",
        sub: "Modeling, generative exploration, look dev, and previs—virtual cameras and projection studies for scale and depth",
      },
      {
        label: "IMMERSIVE LIVE-SHOW CONCEPTS",
        sub: "Cinematic sequences for LED and projection illusions—forced perspective, lighting sync, and show visualization",
      },
    ],
    worlds: [
      {
        title: "The Gods",
        description:
          "Monumental mythological beings, celestial entities, and ancient-inspired architecture that transform the stage into an awakening world.",
      },
      {
        title: "The Gatekeepers",
        description:
          "Colossal serpents, panthers, and other guardians that emerge from hidden dimensions, protecting gateways to worlds beyond the visible stage.",
      },
      {
        title: "The Revelations",
        description:
          "Layered illusions in which familiar concert architecture transforms, fractures, expands, and reveals something unexpected beneath it.",
      },
    ],
    media: [
      "/images/gods-gatekeepers-workflow-deity.jpg",
      "/images/gods-gatekeepers-workflow-panthers.jpg",
      "/images/gods-gatekeepers-revelations.jpg",
    ],
  },
];

/** Portfolio display order (spotlight last). */
export function portfolioProjects(list: readonly Project[] = projects): Project[] {
  const index = list.findIndex((p) => p.slug === SPOTLIGHT_SLUG);
  if (index < 0 || index === list.length - 1) return [...list];
  const ordered = [...list];
  const [spotlight] = ordered.splice(index, 1);
  ordered.push(spotlight);
  return ordered;
}

export interface LabItem {
  slug: string;
  title: string;
  kind: string;
  tagline: string;
  body: string;
  rationale: string;
  status: string;
}

export const labItems: LabItem[] = [
  {
    slug: "creative-studio-pro",
    title: "CREATIVE STUDIO PRO",
    kind: "AGENTIC FILM STUDIO",
    tagline: "A canvas-first studio for AI short films, commercials, and trailers.",
    body: "An agentic workflow takes an idea from story development and shot planning through generation to a finished edit. Shape the story on a visual board, review the images and video for each shot, and trim the approved footage into a final cut. Generation runs only after approval and a cost check.",
    rationale: "Keep creative decisions close to story beats, takes, and cuts so I can see what a sequence needs before generating more material.",
    status: "In development",
  },
  {
    slug: "music-video-agent",
    title: "MUSIC VIDEO AGENT",
    kind: "AGENTIC · LOCAL",
    tagline: "An agentic workspace for building a music video around a song.",
    body: "Analyze the song, develop the story, craft the prompts, and generate the images and videos. Review agents powered by different LLMs independently evaluate and score the results. The user then reviews the creative direction and generated outputs, selects the final option, and gives final approval.",
    rationale: "I want help developing alternatives and reviewing the results while keeping creative direction and the final selection with the maker.",
    status: "In development",
  },
];

export const skillGroups = [
  { title: "Visual storytelling", items: ["Concepts, worlds, and sequences developed through 3D, VFX, and AI filmmaking."] },
  { title: "Immersive & interactive experiences", items: ["Experiences that let people explore an idea or shape what happens."] },
  { title: "Creative tools", items: ["Apps for gathering references, developing stories, working with footage, and reviewing results."] },
  { title: "Production systems", items: ["The workflows and technical foundations that carry creative work from exploration through delivery."] },
];

export const site = {
  name: "Gordo",
  label: "V1SU4",
  role: "Visual Artist / Creative Technologist",
  focus: "Film, television, commercials, and immersive experiences",
  mission: "I make visual stories, immersive experiences, and creative tools, bringing ideas to life across film, television, commercials, and interactive work.",
  description: "Gordo’s visual stories, immersive experiences, and creative tools across film, television, commercials, and interactive work.",
  about: [
    "I’m Gordo, a visual artist and creative technologist. I like figuring out what an idea could become, then working through the details that make it feel right.",
    "My background is in VFX for film, television, and commercials, with Houdini still a big part of how I work. These days, I’m making AI films, commercials, and original series, developing immersive experiences, and building apps that support the creative process—from exploring an idea to bringing it through production. Sometimes the work is an image or a sequence; sometimes it’s a tool that makes the next project easier to make. I care about the creative choices and the technical work needed to carry them through to a polished result.",
    "I grew up performing as a singer and dancer, including two and a half years in a Broadway show. There’s a whole earlier chapter there, if you ever want to ask.",
  ],
  archives: "My film and television background includes FX work at ILM, DNEG, MPC, and The Mill. Explore the reel and credits for that part of my work.",
  lab: "A place for ideas I’m still working out: prototypes, creative workflows, and tools taking shape through use.",
  contactHeading: "Have something in mind?",
  contactBody: "I’m happy to talk about a film, a commercial, an immersive experience, or a tool you wish existed.",
  contactUrl: "https://www.linkedin.com/in/gordo-spaniolo/",
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
