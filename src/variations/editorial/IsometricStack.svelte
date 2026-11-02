<script lang="ts">
  import type { StackLayer } from './stackLayers';

  let {
    stackId = 'stack',
    title,
    description,
    caption,
    layers,
    connections = [],
  }: {
    stackId?: string;
    title: string;
    description: string;
    caption?: string;
    layers: StackLayer[];
    connections?: string[];
  } = $props();

  const pitch = 66;
  const stackBase = $derived(260 + Math.max(0, layers.length - 4) * 48);
  const svgHeight = $derived(stackBase + 72);

  function point(x: number, y: number, z: number) {
    return `${120 + x - y},${220 + (x + y) / 2 - z}`;
  }
  function rounded(x: number, y: number, w: number, h: number, z: number, r = 4) {
    return `M${point(x + r, y, z)}L${point(x + w - r, y, z)}Q${point(x + w, y, z)} ${point(x + w, y + r, z)}L${point(x + w, y + h - r, z)}Q${point(x + w, y + h, z)} ${point(x + w - r, y + h, z)}L${point(x + r, y + h, z)}Q${point(x, y + h, z)} ${point(x, y + h - r, z)}L${point(x, y + r, z)}Q${point(x, y, z)} ${point(x + r, y, z)}Z`;
  }
  function motif(i: number, accent: boolean) {
    if (i === 0) return 'storage';
    if (i === layers.length - 1) return 'interface';
    if (accent) return 'orchestration';
    if (i === 1) return 'services';
    return 'generic';
  }
</script>

<figure class="workflow-stack">
  <svg viewBox={`0 0 540 ${svgHeight}`} role="img" aria-labelledby="{stackId}-title {stackId}-desc">
    <title id="{stackId}-title">{title}</title>
    <desc id="{stackId}-desc">{description}</desc>
    <defs>
      <linearGradient id="{stackId}-neutral-face" x1="0" y1="0" x2="0.8" y2="1">
        <stop stop-color="#3b3b40" /><stop offset="1" stop-color="#29292d" />
      </linearGradient>
      <linearGradient id="{stackId}-accent-face" x1="0" y1="0" x2="0.8" y2="1">
        <stop stop-color="color-mix(in srgb, var(--project-accent) 42%, #3b3b40)" />
        <stop offset="1" stop-color="color-mix(in srgb, var(--project-accent) 22%, #29292d)" />
      </linearGradient>
      <linearGradient id="{stackId}-accent-chip" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="color-mix(in srgb, var(--project-accent) 72%, #ffffff)" />
        <stop offset="1" stop-color="var(--project-accent)" />
      </linearGradient>
      <filter id="{stackId}-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="8" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
    <path class="guides" d={`M40 62V${svgHeight - 28}`} />
    <path class="guides" d={`M200 62V${svgHeight - 28}`} />
    {#each layers as layer, i (layer.name)}
      {@const z = i * pitch}
      {@const cy = stackBase - z}
      {@const kind = motif(i, !!layer.accent)}
      <g class:focal={layer.accent} class:pending={layer.pending}>
        <path class="side" d={rounded(0, 0, 80, 80, z - 8, 5)} />
        <path class="lit-side" d={`M${point(0, 74, z)}Q${point(0, 80, z)} ${point(6, 80, z)}L${point(80, 80, z)}L${point(80, 80, z - 8)}L${point(6, 80, z - 8)}Q${point(0, 80, z - 8)} ${point(0, 74, z - 8)}Z`} />
        <path class="shade-side" d={`M${point(80, 80, z)}L${point(80, 6, z)}Q${point(80, 0, z)} ${point(74, 0, z)}L${point(74, 0, z - 8)}Q${point(80, 0, z - 8)} ${point(80, 6, z - 8)}L${point(80, 80, z - 8)}Z`} />
        <path
          class="top"
          d={rounded(0, 0, 80, 80, z, 5)}
          fill={layer.accent ? `url(#${stackId}-accent-face)` : `url(#${stackId}-neutral-face)`}
        />
        <path class="grain" d={rounded(0, 0, 80, 80, z, 5)} filter={`url(#${stackId}-grain)`} aria-hidden="true" />
        <path class="rim" d={rounded(9, 9, 62, 62, z, 4)} />
        {#if kind === 'interface'}
          <path class="screen" d={rounded(14, 14, 52, 52, z, 4)} />
          <path class="detail" d={`M${point(14, 24, z)}L${point(66, 24, z)}`} />
          <path class="ui-tile" d={rounded(20, 31, 18, 27, z, 2)} />
          <path class="ui-tile" d={rounded(43, 31, 17, 13, z, 2)} />
          <path class="ui-selected" d={rounded(43, 49, 17, 9, z, 2)} />
        {:else if kind === 'orchestration'}
          <path class="routing" d={`M${point(40, 18, z)}L${point(58, 18, z)}Q${point(62, 18, z)} ${point(62, 22, z)}L${point(62, 40, z)}M${point(58, 35, z)}L${point(62, 40, z)}L${point(66, 35, z)}M${point(40, 62, z)}L${point(22, 62, z)}Q${point(18, 62, z)} ${point(18, 58, z)}L${point(18, 40, z)}M${point(14, 45, z)}L${point(18, 40, z)}L${point(22, 45, z)}`} />
          <path class="core-side" d={rounded(29, 29, 22, 22, z, 2)} />
          <path class="core-lit" d={`M${point(29, 29, z + 5)}L${point(29, 51, z + 5)}L${point(51, 51, z + 5)}L${point(51, 51, z)}L${point(29, 51, z)}L${point(29, 29, z)}Z`} />
          <path class="core-shade" d={`M${point(51, 29, z + 5)}L${point(51, 51, z + 5)}L${point(51, 51, z)}L${point(51, 29, z)}Z`} />
          <path class="core" d={rounded(29, 29, 22, 22, z + 5, 2)} fill={`url(#${stackId}-accent-chip)`} />
          <path class="detail" d={`M${point(29, 51, z)}L${point(29, 51, z + 5)}M${point(51, 51, z)}L${point(51, 51, z + 5)}`} />
        {:else if kind === 'services'}
          {#each [18, 40, 62] as x (x)}
            <path class="service-side" d={rounded(x - 7, 27, 14, 26, z, 2)} />
            <path class="service" d={rounded(x - 7, 27, 14, 26, z + 3, 2)} />
          {/each}
        {:else if kind === 'storage'}
          <path class="folder-back" d={`M${point(20, 29, z + 5)}L${point(20, 20, z + 5)}L${point(34, 20, z + 5)}L${point(40, 27, z + 5)}L${point(62, 27, z + 5)}L${point(62, 56, z + 5)}L${point(20, 56, z + 5)}Z`} />
          <path class="folder-side" d={`M${point(18, 33, z + 2)}L${point(64, 33, z + 2)}L${point(62, 60, z + 2)}L${point(62, 60, z)}L${point(18, 60, z)}Z`} />
          <path class="folder-front" d={`M${point(18, 33, z + 2)}L${point(64, 33, z + 2)}L${point(62, 60, z + 2)}L${point(18, 60, z + 2)}Z`} />
          <path class="folder-highlight" d={`M${point(21, 36, z + 2)}L${point(60, 36, z + 2)}`} />
        {:else}
          <path class="screen" d={rounded(22, 22, 36, 36, z, 3)} />
          <path class="detail" d={`M${point(26, 30, z)}L${point(54, 30, z)}M${point(26, 38, z)}L${point(48, 38, z)}`} />
        {/if}
        <path class="leader" d={`M204 ${cy}H238`} />
        <circle class="port" cx="201" {cy} r="1.8" />
        <text class="role" x="254" y={cy - 15}>{layer.role}</text>
        <text class="name" x="254" y={cy + 3}>{layer.name}</text>
        <text class="detail-label" x="254" y={cy + 20}>{layer.detail}</text>
      </g>
    {/each}
  </svg>
  {#if caption}<figcaption>{caption}</figcaption>{/if}
  {#if connections.length}
    <div class="connections"><span>System connections</span><ul>{#each connections as connection (connection)}<li>{connection}</li>{/each}</ul></div>
  {/if}
</figure>

<style>
  .workflow-stack { max-width: 580px; margin-top: 18px; }
  svg { display: block; width: 100%; height: auto; }
  .guides { stroke: #ffffff24; stroke-width: .6; stroke-dasharray: 3 4; fill: none; }
  .top { stroke: #b1b1b6; stroke-width: .7; stroke-linejoin: miter; }
  .side { fill: #171719; stroke: #99999f; stroke-width: .7; stroke-linejoin: miter; }
  .lit-side { fill: #303035; stroke: #99999f; stroke-width: .5; stroke-linejoin: miter; }
  .shade-side { fill: #1d1d21; stroke: #85858c; stroke-width: .5; stroke-linejoin: miter; }
  .grain { fill: #fff; opacity: .055; pointer-events: none; }
  .rim, .detail { fill: none; stroke: #92929a; stroke-width: .6; }
  .service-side { fill: #242427; stroke: #96969d; stroke-width: .5; }
  .service { fill: #424247; stroke: #aaaab1; stroke-width: .6; }
  .screen { fill: #232326; stroke: #8d8d94; stroke-width: .55; }
  .ui-tile { fill: #35353a; stroke: #9999a0; stroke-width: .5; }
  .ui-selected { fill: #b4b4bc; stroke: #d3d3d8; stroke-width: .5; }
  .folder-back { fill: #797981; stroke: #c5c5cd; stroke-width: .6; stroke-linejoin: miter; }
  .folder-front { fill: #515159; stroke: #b6b6bf; stroke-width: .6; stroke-linejoin: miter; }
  .folder-side { fill: #333339; stroke: #9999a3; stroke-width: .5; }
  .folder-highlight { fill: none; stroke: #aaaab3; stroke-width: .6; }
  .focal .top { stroke: var(--project-accent); }
  .focal .side { stroke: color-mix(in srgb, var(--project-accent) 70%, #999); }
  .focal .lit-side { fill: color-mix(in srgb, var(--project-accent) 28%, #303035); stroke: color-mix(in srgb, var(--project-accent) 55%, #999); }
  .focal .shade-side { fill: color-mix(in srgb, var(--project-accent) 18%, #1d1d21); stroke: color-mix(in srgb, var(--project-accent) 45%, #85858c); }
  .focal .rim, .focal .detail { stroke: color-mix(in srgb, var(--project-accent) 65%, #92929a); }
  .core-side { fill: color-mix(in srgb, var(--project-accent) 55%, #29292d); stroke: var(--project-accent); stroke-width: .6; }
  .core-lit { fill: color-mix(in srgb, var(--project-accent) 70%, #444); stroke: var(--project-accent); stroke-width: .45; }
  .core-shade { fill: color-mix(in srgb, var(--project-accent) 40%, #1a1a1a); stroke: color-mix(in srgb, var(--project-accent) 80%, #666); stroke-width: .45; }
  .core { stroke: color-mix(in srgb, var(--project-accent) 80%, #fff); stroke-width: .6; }
  .routing { fill: none; stroke: color-mix(in srgb, var(--project-accent) 75%, #fff); stroke-width: .85; stroke-linecap: round; stroke-linejoin: round; }
  .leader { fill: none; stroke: #73737a; stroke-width: .6; }
  .port { fill: #9999a0; }
  .focal .leader { stroke: color-mix(in srgb, var(--project-accent) 70%, #73737a); }
  .focal .port { fill: var(--project-accent); }
  .pending .top { stroke-dasharray: 4 3; }
  .role { font-family: var(--font-mono); font-size: 8px; letter-spacing: .07em; fill: var(--color-zinc-500); text-transform: uppercase; }
  .focal .role { fill: var(--project-accent); }
  .name { font-family: var(--font-narrow); font-size: 16px; fill: var(--color-zinc-100); }
  .detail-label { font-family: var(--font-mono); font-size: 9px; fill: var(--color-zinc-400); }
  figcaption { margin-top: 8px; font-family: var(--font-mono); font-size: 10px; line-height: 1.6; color: var(--color-zinc-400); }
  .connections { border-top: .5px dashed color-mix(in srgb, var(--project-accent) 35%, #ffffff30); margin-top: 16px; padding-top: 12px; font: 10px/1.8 var(--font-mono); color: var(--color-zinc-400); }
  .connections ul { margin: 8px 0 0; padding: 0; list-style: none; }
  @media (max-width: 639px) { .workflow-stack { margin-top: 12px; max-width: 360px; } figcaption { font-size: 9px; } }
</style>
