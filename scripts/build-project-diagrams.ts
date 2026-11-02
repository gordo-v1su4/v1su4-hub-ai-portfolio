import { mkdir, writeFile } from 'node:fs/promises';
import { workflowDiagrams, type DiagramPath } from '../src/variations/editorial/diagramData';

function pathD(entry: DiagramPath): string {
  return typeof entry === 'string' ? entry : entry.d;
}
function pathShowsArrow(entry: DiagramPath): boolean {
  return typeof entry === 'string' ? true : entry.arrow !== false;
}
function pathOptional(entry: DiagramPath): boolean {
  return typeof entry === 'object' && entry.optional === true;
}
const out = new URL('../src/variations/editorial/diagrams/', import.meta.url);
await mkdir(out, { recursive: true });
const accents: Record<string, string> = {
  'review-room': '#7dd9c8',
  'video-haven': '#e82a44',
  'trailer-feed': '#eabf45',
  'pindeck': '#3a7bff',
  'beatsmaxxer-pro': '#4ade80',
  'music-video-agent': '#a78bfa',
  'creative-studio-pro': '#99f6e4',
  'frame-lab': '#d4d4d4',
  'gods-gatekeepers': '#f3263e',
};
const esc = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
function mixHex(accent: string, base: string, amount: number) {
  const channel = (hex: string, i: number) => Number.parseInt(hex.slice(i, i + 2), 16);
  const parts = [1, 3, 5].map((i) => Math.round(channel(accent, i) * amount + channel(base, i) * (1 - amount)));
  return `#${parts.map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}
function wrap(s: string, max: number) {
  const lines: string[] = [];
  for (const word of s.split(' ')) {
    const i = lines.length - 1;
    if (i < 0 || lines[i].length + word.length + 1 > max) lines.push(word);
    else lines[i] += ' ' + word;
  }
  return lines;
}
const surfaces = ['#2e2e2e', '#2a2a2a', '#262626', '#222222', '#1e1e1e', '#1a1a1a', '#161616', '#121212'];
const focalFills: Record<string, Record<string, string>> = {
  'beatsmaxxer-pro': { timing: '#1b3529', perform: '#102318', video: '#163025', resolve: '#0d1f16' },
  'review-room': { versions: '#1a2f2b', delivery: '#172926' },
  'trailer-feed': { catalog: '#2e2818', browse: '#262010' },
  'pindeck': { analyze: '#172338', decks: '#152035' },
  'video-haven': { collection: '#2a1418' },
  'creative-studio-pro': { gate: '#182826', takes: '#152422' },
  'music-video-agent': { story: '#221a33', render: '#1a1528' },
  'frame-lab': { observe: '#242424' },
  'gods-gatekeepers': { show: '#2a1216' },
};
function nodeFill(slug: string, key: string, i: number, focal: boolean) {
  if (focal) return focalFills[slug]?.[key] ?? '#1a1a1a';
  return surfaces[Math.min(i, surfaces.length - 1)];
}
function nodeStroke(slug: string, _key: string, focal: boolean) {
  if (!focal) return '#ffffff24';
  return accents[slug];
}
const NODE_HEIGHT = 56;
const NODE_WIDTH = 208;
const TITLE_SIZE = 13;
const DETAIL_SIZE = 10;

for (const [slug, d] of Object.entries(workflowDiagrams)) {
  const id = `${slug}-workflow`;
  const accent = accents[slug];
  const nodeHeight = NODE_HEIGHT;
  const dimensions = d.nodes.map((node, i) => {
    const titleLines = wrap(node[1], 30).length;
    const bodyY = titleLines > 1 ? 44 : 38;
    return { node, bodyY, height: nodeHeight, i };
  });
  const nodes = dimensions
    .map(({ node, bodyY, height, i }) => {
      const [key, title, sub, x, y] = node;
      const kind = node[5];
      const focal = d.focal.includes(key);
      const fill = nodeFill(slug, key, i, focal);
      const stroke = nodeStroke(slug, key, focal);
      const titleFill = focal ? mixHex(accent, '#d4d4d8', 0.45) : '#c9c9cf';
      const detailFill = focal ? mixHex(accent, '#a1a1aa', 0.18) : '#a1a1aa';
      const strokeOpacity = focal ? ' stroke-opacity="0.25"' : '';
      const classes = [focal ? 'focal' : '', kind === 'store' ? 'store' : ''].filter(Boolean).join(' ');
      return `<g class="${classes}"><rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${height}" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="${focal ? 1 : 0.7}"${strokeOpacity}/><text x="${x + 12}" y="${y + 18}" class="node-name" fill="${titleFill}">${wrap(title, 30).map((l, j) => `<tspan x="${x + 12}" dy="${j ? 14 : 0}">${esc(l)}</tspan>`).join('')}</text><text x="${x + 12}" y="${y + bodyY}" class="node-detail" fill="${detailFill}">${wrap(sub, 32).map((l, j) => `<tspan x="${x + 12}" dy="${j ? 12 : 0}">${esc(l)}</tspan>`).join('')}</text></g>`;
    })
    .join('');
  const pathMarkup = d.paths
    .map((entry) => {
      const dAttr = pathD(entry);
      const marker = pathShowsArrow(entry) ? ` marker-end="url(#${id}-arrow)"` : '';
      const dash = pathOptional(entry) ? ' stroke-dasharray="5,4"' : '';
      return `<path d="${dAttr}"${marker}${dash}/>`;
    })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 ${d.height}" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(d.title)}</title><desc id="${id}-desc">${esc(d.description)}</desc><defs><marker id="${id}-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="${accent}" stroke-width="1.2"/></marker></defs><style>.node-name{font-family:'Archivo Narrow',Arial,sans-serif;font-weight:500;font-size:${TITLE_SIZE}px;letter-spacing:.06em;text-transform:uppercase}.node-detail{font-family:'Geist Mono',monospace;font-size:${DETAIL_SIZE}px}</style><g fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${pathMarkup}</g>${nodes}</svg>`;
  await writeFile(
    new URL(`${slug}-workflow.html`, out),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.title)}</title><link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@500&amp;family=Geist+Mono&amp;display=swap" rel="stylesheet"><style>body{margin:0;padding:24px;background:#09090b;color:#c9c9cf}h1{font:500 26px 'Archivo Narrow',sans-serif}p{font:11px/1.8 'Geist Mono',monospace;color:#a1a1aa;max-width:90ch}.diagram{overflow-x:auto}svg{display:block;width:1100px;max-width:none}</style></head><body><h1>${esc(d.title)}</h1><p>${esc(d.description)}</p><div class="diagram">${svg}</div></body></html>`,
  );
}
console.log(`Built ${Object.keys(workflowDiagrams).length} source-specific diagrams.`);
