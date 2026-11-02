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
  /** Optional second line under the status label (e.g. Beta + ongoing build). */
  statusNote?: string;
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
    tagline: "Story, characters, and production material for an original series.",
    rationale: "I wanted someone to be able to get to know a fictional world through both its finished imagery and the work taking shape behind it.",
    role: "Creative Direction / Production / Development",
    status: "In Development",
    year: "2026",
    stack: ["React", "TypeScript", "Vite", "GSAP", "Three.js"],
    stackGroups: [{ title: "Front end", items: ["React", "TypeScript", "Vite", "GSAP", "Three.js"] }, { title: "Back end", items: ["Static site · no server backend"] }, { title: "Production tasks", items: ["Series breakdown", "Interactive DVD collection", "Character auditions", "Storyboards and working previews"] }],
    cover: "/images/captures/2026-10-19/video-haven-home-v2.webp",
    imageFit: "contain",
    link: "https://www.videohaven.stream/",
    what: "A show-specific series breakdown bringing together the story, characters, locations, storyboards and working footage. Blood Rush is the first series, presented through Video Haven’s interactive collection.",
    flow: [{ label: "SERIES", sub: "Explore the story and visual direction" }, { label: "COLLECTION", sub: "Browse working previews and development tests" }, { label: "WORLD", sub: "Meet the characters and explore locations" }, { label: "PRODUCTION", sub: "Follow storyboards and production development" }],
    media: [
      "/images/captures/2026-10-19/video-haven-dvd-shelf-v2.webp",
      "/images/captures/2026-10-19/video-haven-foil-detail-v2.webp",
      "/images/captures/2026-10-19/video-haven-characters-v2.webp",
    ],
  },
  {
    slug: "review-room",
    title: "REVIEW ROOM",
    group: "more",
    type: "Review & Dailies",
    tagline: "Central library for takes, metadata, review, and delivery.",
    role: "Design / Development",
    status: "In Production",
    rationale: "Keeping review close to the footage helps me follow a shot from upload through feedback without losing the conversation around it. Review Room also gives my media a central home on my own server. I can upload a file once and reference it across my other apps, keeping everything connected without uploading the same video in three different places.",
    year: "2026",
    stack: ["Svelte", "Convex", "RustFS", "Trigger.dev"],
    stackGroups: [{ title: "Front end", items: ["Svelte"] }, { title: "Back end", items: ["Convex", "RustFS", "Trigger.dev"] }, { title: "Production tasks", items: ["Project media and daily playlists", "Shot review, comments and ratings", "Client notifications"] }],
    cover: "/images/captures/2026-10-17/review-room-cover-final.jpg",
    imageFit: "contain",
    link: "https://www.linkedin.com/in/gordo-spaniolo/",
    linkLabel: "Request a demo",
    media: ["/images/captures/2026-10-17/review-room-library-retake.jpg","/images/captures/2026-10-17/review-room-list.webp","/images/captures/2026-10-17/review-room-table.webp","/images/captures/2026-10-17/review-room-drawover.webp","/images/captures/2026-10-17/review-room-publishing.webp","/images/captures/2026-10-17/review-room-media-flow.webp","/images/captures/2026-10-17/review-room-metadata-model.webp"],
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
    cover: "/images/captures/2026-10-19/pindeck-gallery-detail.webp",
    media: [
      "/images/captures/2026-10-19/pindeck-table-palettes.webp",
      "/images/captures/2026-10-19/pindeck-deck-composer.webp",
      "/images/captures/2026-10-19/pindeck-storyboard.webp",
      "/images/captures/2026-10-19/pindeck-pinterest-import.webp",
      "/images/captures/2026-10-19/pindeck-docs.webp",
      "/images/captures/2026-10-19/pindeck-architecture-detail.webp",
      "/images/pindeck-workspace.png",
    ],
    imageFit: "contain",
    link: "https://www.pindeck.dev",
    what: "One workspace for image curation. Images come in from Discord, Pinterest or upload, get tagged and color-analyzed automatically, branch into AI variations with full lineage, and end up on curated boards, storyboards and pitch decks.",
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
    cover: "/images/captures/2026-10-18/beatsmaxxer-perform-graphics-v2.webp",
    imageFit: "contain",
    media: [
      "/images/captures/2026-10-18/beatsmaxxer-perform-video-v2.webp",
      "/images/captures/2026-10-18/beatsmaxxer-clip-bank-v2.webp",
      "/images/captures/2026-10-18/beatsmaxxer-rack-detail-v2.webp",
      "/images/captures/2026-10-18/beatsmaxxer-timing-v2.webp",
      "/images/captures/2026-10-18/beatsmaxxer-arrangement-v2.webp",
      "/images/captures/2026-10-18/beatsmaxxer-help-v2.webp",
    ],
    link: "https://www.beatsmaxxing.com",
    what: "Eight clip slots, a program monitor that cuts on the beat, and 19 WebGPU shader effects. Song sections land on a timeline; ramps, stutters and jump cuts lock to the beat grid. Runs in the browser, on phones, and as a Windows app.",
    rationale: "I’m exploring how much of the timing can happen automatically while leaving room to choose the clips, shape the look, and perform.",
    flow: [
      { label: "ANALYSIS", sub: "Beats · sections · tempo" },
      { label: "AUDIO-REACTIVE EDIT", sub: "Cuts · ramps · stutters locked to the beat grid" },
      { label: "RACK", sub: "10 clip slots · reusable clip banks · shader FX" },
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
    tagline: "Finished AI videos with versions, prompts, and models in one place.",
    role: "Design / Development",
    status: "Live",
    year: "2026",
    stack: ["SvelteKit", "Python", "SQLite", "RustFS"],
    stackGroups: [{ title: "Front end", items: ["SvelteKit"] }, { title: "Back end", items: ["Python", "SQLite", "RustFS"] }, { title: "Production tasks", items: ["Finished project import", "Version playback and comparison", "Prompt and model reference library"] }],
    cover: "/images/captures/2026-10-20/trailer-feed-home-photo-v2.png",
    previewImage: "/images/captures/2026-10-20/trailer-feed-kick.webp",
    media: ["/images/captures/2026-10-20/trailer-feed-main.webp","/images/captures/2026-10-20/trailer-feed-comparison.webp","/images/captures/2026-10-20/trailer-feed-prompts.webp","/images/captures/2026-10-20/trailer-feed-details.webp"],
    imageFit: "contain",
    link: "https://trailerfeed.video",
    what: "A video portfolio for importing anything from first-draft ideas to finished projects, watching versions, comparing takes, and keeping prompts and model metadata alongside the videos. Prompts and sources are kept as a reference library.",
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
    statusNote: "In active development",
    year: "2026",
    stack: ["Next.js", "Trigger.dev", "Essentia", "ComfyUI"],
    stackGroups: [{ title: "Front end", items: ["Next.js"] }, { title: "Back end", items: ["Trigger.dev", "Essentia"] }, { title: "Production tasks", items: ["Scene detection and shot matching", "ComfyUI · AI gap generation", "Beat-aligned preview and export"] }],
    cover: "/images/project-stack-workspace.png",
    imageFit: "contain",
    link: "https://project-stack-structure.vercel.app",
    what: "Real footage drives the edit. The song is analyzed for beats and sections, clips are scene-detected and captioned, moments are matched to the story, and AI generation fills only the gaps, using cloud models or local ComfyUI.",
    rationale: "I’m exploring how software can help organize an edit while keeping the supplied footage central to the result.",
    flow: [
      { label: "INGEST", sub: "Analyze the song, detect scenes, and caption footage." },
      { label: "STORY", sub: "Choose a treatment, resolve anchors, and confirm the plan." },
      { label: "SPLIT", sub: "Build source cut windows around the confirmed story." },
      { label: "MATCH", sub: "Review footage candidates for each section and edit slot." },
      { label: "GENERATE", sub: "Fill missing coverage or create replacement shots." },
      { label: "JOIN", sub: "Assemble approved shots into the story timeline." },
      { label: "EFFECTS", sub: "Review transitions and the visual treatment." },
      { label: "EXPORT", sub: "Preview the finished sequence and render the MP4." },
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
    tagline: "Ancient mythology, impossible scale, and worlds within worlds.",
    rationale:
      "The project asks how a stage might feel like an unfolding world, with depth and transformation becoming part of the experience.",
    role: "Creative Direction / Worldbuilding / 3D / AI / VFX / Previsualization",
    status: "In Development",
    year: "2026",
    stack: ["Maya", "Houdini", "Unreal Engine", "ComfyUI", "Nuke", "After Effects"],
    stackGroups: [
      {
        title: "Concept",
        items: ["Art direction", "Worldbuilding", "Story development"],
      },
      {
        title: "Visual development",
        items: ["3D & AI exploration", "Look development", "Previsualization"],
      },
      {
        title: "Show delivery",
        items: ["LED concepts", "Lighting & perspective", "Show visualization"],
      },
    ],
    cover: "/images/gods-gatekeepers-hero-16x10.webp",
    imageFit: "contain",
    previewImage: "/images/gods-gatekeepers-hero.jpg",
    what: "Immersive concert concepts where DJ stages become evolving illusions. Monumental deities awaken, colossal guardians emerge from flat screens, and celestial gateways reveal dimensions hidden inside the architecture—each world expandable for different cities and performances through a hybrid 3D, AI, and VFX workflow.",
    flow: [
      {
        label: "Worldbuilding",
        sub: "Develop the mythology, environments, and key reveals.",
      },
      {
        label: "Visual development",
        sub: "Explore scale, materials, and movement through 3D and AI.",
      },
      {
        label: "Show concept",
        sub: "Shape the sequences into a connected live-show concept.",
      },
    ],
    worlds: [
      {
        title: "The Gods",
        description:
          "Mythological beings and ancient architecture awaken at monumental scale.",
      },
      {
        title: "The Gatekeepers",
        description:
          "Serpents, panthers, and other guardians mark the gateways between worlds.",
      },
      {
        title: "The Revelations",
        description:
          "Familiar stage structures fracture and transform, revealing hidden worlds.",
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
    body: "A song-led workspace for analyzing a master and its stems, developing timed story sections, and preparing continuity references and production approvals. A separate local pilot uses Qwen character sheets, H3 shot generation, and FFmpeg assembly. Full in-app generation, reviewer-model comparison, and final export are still being developed, with creative direction and final approval kept with the maker.",
    rationale: "I want help developing alternatives and reviewing the results while keeping creative direction and the final selection with the maker.",
    status: "In development",
  },
];

export const softwareGroups = [
  { title: "Generative AI", items: ["ComfyUI", "LoRA training", "Image", "Video", "Audio"] },
  { title: "3D / VFX", items: ["Houdini", "Unreal Engine", "Nuke", "After Effects"] },
  { title: "Web", items: ["TypeScript", "Svelte", "React", "WebGPU"] },
  { title: "Backend", items: ["Python", "Rust", "Convex", "Trigger.dev", "Docker"] },
];

export const skillGroups = [
  { title: "Visual storytelling", items: ["Concepts, worlds, and sequences developed through 3D, VFX, and AI filmmaking."] },
  { title: "Immersive experiences", items: ["Experiences that let people explore an idea or shape what happens."] },
  { title: "Creative tools", items: ["Apps for gathering references, developing stories, working with footage, and reviewing results."] },
  { title: "Production systems", items: ["The workflows and technical foundations that carry creative work from exploration through delivery."] },
];

export const site = {
  name: "Gordo",
  label: "V1SU4",
  role: "Creative Technologist / Visual Artist",
  focus: "Film, television, commercials, and immersive experiences",
  mission: "I make visual stories, immersive experiences, and creative tools, bringing ideas to life across film, television, commercials, and interactive work.",
  description: "Gordo’s visual stories, immersive experiences, and creative tools across film, television, commercials, and interactive work.",
  about: [
    "I’m Gordo, a creative technologist and visual artist. I like figuring out what an idea could become, then working through the details that make it feel right.",
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
    { label: "IMDB", href: "https://www.imdb.com/name/nm6667790/" },
    { label: "GITHUB", href: "https://github.com/gordo-v1su4" },
    { label: "LINKEDIN", href: "https://www.linkedin.com/in/gordo-spaniolo/" },
    { label: "INSTAGRAM", href: "https://www.instagram.com/shotbyspaniolo" },
    { label: "MIDJOURNEY", href: "https://www.midjourney.com/@gordo" },
    { label: "VFX REEL", href: "https://vimeo.com/328351564" },
  ],
};
