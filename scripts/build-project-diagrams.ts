import { mkdir, writeFile } from 'node:fs/promises';
import { workflowDiagrams } from '../src/variations/editorial/diagramData';
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
};
const esc = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
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
};
function nodeFill(slug: string, key: string, i: number, focal: boolean) {
  if (focal) return focalFills[slug]?.[key] ?? '#1a1a1a';
  return surfaces[Math.min(i, surfaces.length - 1)];
}
function nodeStroke(slug: string, key: string, focal: boolean) {
  if (!focal) return '#ffffff24';
  const accent = accents[slug];
  if (slug === 'beatsmaxxer-pro' && key === 'perform') return '#3ecf73';
  if (slug === 'beatsmaxxer-pro' && key === 'timing') return '#6ee7a0';
  if (slug === 'trailer-feed' && key === 'browse') return '#f0c85a';
  return accent;
}
for (const [slug, d] of Object.entries(workflowDiagrams)) {
  const id = `${slug}-workflow`;
  const accent = accents[slug];
  const nodeHeight = 96;
  const dimensions = d.nodes.map((node, i) => {
    const bodyY = wrap(node[1], 27).length > 1 ? 62 : 50;
    return { node, bodyY, height: nodeHeight, i };
  });
  const paths = d.paths.map((path) => {
    let adjusted = path.replace(/^M(\d+) (\d+)/, (whole, x, y) => {
      const source = dimensions.find((v) => Number(y) === v.node[4] + 96 && Number(x) >= v.node[3] && Number(x) <= v.node[3] + 208);
      return source ? `M${x} ${source.node[4] + source.height}` : whole;
    });
    const tokens = path.match(/[MHVQ]|\d+/g) ?? [];
    let endX = 0;
    let endY = 0;
    for (let j = 0; j < tokens.length; ) {
      const command = tokens[j++];
      if (command === 'M') {
        endX = Number(tokens[j++]);
        endY = Number(tokens[j++]);
      } else if (command === 'H') endX = Number(tokens[j++]);
      else if (command === 'V') endY = Number(tokens[j++]);
      else if (command === 'Q') {
        j += 2;
        endX = Number(tokens[j++]);
        endY = Number(tokens[j++]);
      }
    }
    const target = dimensions.find((v) => endY === v.node[4] + 96 && endX >= v.node[3] && endX <= v.node[3] + 208);
    if (target) adjusted = adjusted.replace(/V\d+$/, `V${target.node[4] + target.height}`);
    return adjusted;
  });
  const nodes = dimensions
    .map(({ node: [key, title, sub, x, y], bodyY, height, i }) => {
      const focal = d.focal.includes(key);
      const fill = nodeFill(slug, key, i, focal);
      const stroke = nodeStroke(slug, key, focal);
      const titleFill = focal ? accents[slug] : '#c9c9cf';
      const detailFill = focal ? '#b5bcc4' : '#a1a1aa';
      return `<g class="${focal ? 'focal' : ''}"><rect x="${x}" y="${y}" width="208" height="${height}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${focal ? 1 : 0.7}"/><text x="${x + 16}" y="${y + 26}" class="node-name" fill="${titleFill}">${wrap(title, 27).map((l, j) => `<tspan x="${x + 16}" dy="${j ? 18 : 0}">${esc(l)}</tspan>`).join('')}</text><text x="${x + 16}" y="${y + bodyY}" class="node-detail" fill="${detailFill}">${wrap(sub, 27).map((l, j) => `<tspan x="${x + 16}" dy="${j ? 16 : 0}">${esc(l)}</tspan>`).join('')}</text></g>`;
    })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 ${d.height}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(d.title)}</title><desc id="${id}-desc">${esc(d.description)}</desc><defs><marker id="${id}-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="${accent}" stroke-width="1.2"/></marker></defs><style>.node-name{font-family:'Archivo Narrow',Arial,sans-serif;font-weight:500;font-size:16px}.node-detail{font-family:'Geist Mono',monospace;font-size:11px}</style><g fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#${id}-arrow)">${paths.map((path) => `<path d="${path}"/>`).join('')}</g>${nodes}</svg>`;
  await writeFile(
    new URL(`${slug}-workflow.html`, out),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.title)}</title><link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@500&amp;family=Geist+Mono&amp;display=swap" rel="stylesheet"><style>body{margin:0;padding:24px;background:#09090b;color:#c9c9cf}h1{font:500 26px 'Archivo Narrow',sans-serif}p{font:11px/1.8 'Geist Mono',monospace;color:#a1a1aa;max-width:90ch}.diagram{overflow-x:auto}svg{display:block;width:1100px;max-width:none}</style></head><body><h1>${esc(d.title)}</h1><p>${esc(d.description)}</p><div class="diagram">${svg}</div></body></html>`,
  );
}
console.log(`Built ${Object.keys(workflowDiagrams).length} source-specific diagrams.`);
