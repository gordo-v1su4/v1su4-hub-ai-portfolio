import { labItems, portfolioProjects } from '../../data/projects';

export interface Entry {
  slug: string; title: string; category: string; line: string; summary: string;
  format?: string;
  rationale?: string;
  image: string; imageFit?: 'cover' | 'contain'; status: string; year: string;
  previewImage?: string;
  role: string; stack: string[]; flow: {label: string; sub: string}[];
  stackGroups?: {title: string; items: string[]}[];
  worlds?: { title: string; description: string }[];
  link?: string; media: string[]; experimental: boolean;
}
export const work: Entry[] = portfolioProjects().map(p => ({
  slug: p.slug, title: p.title, category: p.type, line: p.tagline,
  format: p.format,
  rationale: p.rationale,
  summary: p.what, image: p.cover, previewImage: p.previewImage, imageFit: p.imageFit, status: p.status,
  year: p.year, role: p.role, stack: p.stack, stackGroups: p.stackGroups, flow: p.flow, link: p.link,
  worlds: p.worlds,
  media: p.media ?? [], experimental: false,
}));
export const lab: Entry[] = labItems.map(p => ({
  slug: p.slug, title: p.title, category: p.kind, line: p.tagline,
  summary: p.body, image: p.slug === 'creative-studio-pro' ? '/images/creative-studio-workspace.png' : '/images/music-video-workspace.png',
  imageFit: 'contain', status: p.status, year: '2026', role: 'Research / Development',
  stack: p.slug === 'creative-studio-pro' ? ['SvelteKit', 'Svelte Flow', 'AI SDK', 'Bun', 'WebGPU'] : ['SvelteKit', 'Rust', 'Convex', 'RustFS', 'FFmpeg'],
  stackGroups: p.slug === 'creative-studio-pro'
    ? [{title: 'Front end', items: ['SvelteKit', 'Svelte Flow', 'WebGPU']}, {title: 'Back end', items: ['Bun', 'AI SDK']}, {title: 'Production tasks', items: ['Story and production boards', 'Approved generation and take review', 'Cut trimming and publishing']}]
    : [{title: 'Front end', items: ['SvelteKit']}, {title: 'Back end', items: ['Rust', 'Convex', 'RustFS']}, {title: 'Production tasks', items: ['Song analysis and treatment', 'Story and shot planning', 'FFmpeg · media processing']}],
  flow: p.slug === 'creative-studio-pro' ? [{label: 'STORY', sub: 'Develop the brief and story beats'}, {label: 'BOARD', sub: 'Arrange beats on a production canvas'}, {label: 'TAKES', sub: 'Approve generation and review takes'}, {label: 'CUTS', sub: 'Trim, finish and publish'}] : [{label: 'SONG', sub: 'Analyze beats and song sections'}, {label: 'TREATMENT', sub: 'Develop the music-video direction'}, {label: 'STORY', sub: 'Arrange the narrative and shot plan'}, {label: 'PRODUCTION', sub: 'Prepare approved shots for generation'}],
  media: [], experimental: true,
}));
export const all = [...work, ...lab];
export const href = (p: Entry) => `#/${p.experimental ? 'lab' : 'work'}/${p.slug}`;
