import { projects, labItems } from '../../data/projects';

export interface Entry {
  slug: string; title: string; category: string; line: string; summary: string;
  image: string; imageFit?: 'cover' | 'contain'; status: string; year: string;
  role: string; stack: string[]; flow: {label: string; sub: string}[];
  link?: string; media: string[]; experimental: boolean;
}
export const work: Entry[] = projects.map(p => ({
  slug: p.slug, title: p.title, category: p.type, line: p.tagline,
  summary: p.what, image: p.cover, imageFit: p.imageFit, status: p.status,
  year: p.year, role: p.role, stack: p.stack, flow: p.flow, link: p.link,
  media: p.media ?? [], experimental: false,
}));
export const lab: Entry[] = labItems.map(p => ({
  slug: p.slug, title: p.title, category: p.kind, line: p.body,
  summary: p.body, image: p.slug === 'creative-studio-pro' ? '/images/cinema.jpg' : '/images/agents.jpg',
  status: p.status, year: '2026', role: 'Research / Development', stack: [], flow: [],
  media: [], experimental: true,
}));
export const all = [...work, ...lab];
export const href = (p: Entry) => `#/${p.experimental ? 'lab' : 'work'}/${p.slug}`;
