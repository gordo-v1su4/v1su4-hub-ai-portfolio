<script lang="ts">
  // Diagram Design's 2:1 projection: shared footprint, separated workflow roles.
  function point(x: number, y: number, z: number) { return `${120 + x - y},${220 + (x + y) / 2 - z}`; }
  function rounded(x: number, y: number, w: number, h: number, z: number, r = 4) {
    return `M${point(x + r, y, z)}L${point(x + w - r, y, z)}Q${point(x + w, y, z)} ${point(x + w, y + r, z)}L${point(x + w, y + h - r, z)}Q${point(x + w, y + h, z)} ${point(x + w - r, y + h, z)}L${point(x + r, y + h, z)}Q${point(x, y + h, z)} ${point(x, y + h - r, z)}L${point(x, y + r, z)}Q${point(x, y, z)} ${point(x + r, y, z)}Z`;
  }
  const layers = [
    { z: 0, name: 'RustFS', role: 'SHARED STORAGE', detail: 'Media · analysis · exports' },
    { z: 66, name: 'Specialist services', role: 'ANALYZE / GENERATE / RENDER', detail: 'Essentia audio · AI generation · FFmpeg' },
    { z: 132, name: 'Trigger.dev', role: 'ORCHESTRATION', detail: 'Coordinates jobs · retries · status' },
    { z: 198, name: 'Next.js studio', role: 'INTERFACE', detail: 'Upload · plan · review' },
  ];
</script>

<figure class="workflow-stack">
  <svg viewBox="0 0 540 330" role="img" aria-labelledby="workflow-stack-title workflow-stack-desc">
    <title id="workflow-stack-title">The studio workflow as a connected stack</title>
    <desc id="workflow-stack-desc">The Next.js interface submits work to Trigger.dev, which orchestrates specialist services including Essentia for audio analysis, AI for generation, and FFmpeg for rendering. RustFS provides shared media storage.</desc>
    <defs>
      <linearGradient id="stack-neutral-face" x1="0" y1="0" x2="0.8" y2="1"><stop stop-color="#3b3b40" /><stop offset="1" stop-color="#29292d" /></linearGradient>
      <linearGradient id="stack-orange-face" x1="0" y1="0" x2="0.8" y2="1"><stop stop-color="#68432a" /><stop offset="1" stop-color="#422c1e" /></linearGradient>
      <linearGradient id="stack-orange-chip" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f4ae7c" /><stop offset="1" stop-color="#e9843d" /></linearGradient>
      <filter id="stack-surface-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="8" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
    <path class="guides" d="M40 62V300M200 62V300" />
    {#each layers as layer, i (layer.z)}
      {@const z = layer.z}
      {@const cy = 260 - z}
      <g class:focal={i === 2}>
        <path class="side" d={rounded(0, 0, 80, 80, z - 8, 5)} />
        <path class="lit-side" d={`M${point(0, 74, z)}Q${point(0, 80, z)} ${point(6, 80, z)}L${point(80, 80, z)}L${point(80, 80, z - 8)}L${point(6, 80, z - 8)}Q${point(0, 80, z - 8)} ${point(0, 74, z - 8)}Z`} />
        <path class="shade-side" d={`M${point(80, 80, z)}L${point(80, 6, z)}Q${point(80, 0, z)} ${point(74, 0, z)}L${point(74, 0, z - 8)}Q${point(80, 0, z - 8)} ${point(80, 6, z - 8)}L${point(80, 80, z - 8)}Z`} />
        <path class="top" d={rounded(0, 0, 80, 80, z, 5)} />
        <path class="grain" d={rounded(0, 0, 80, 80, z, 5)} filter="url(#stack-surface-grain)" aria-hidden="true" />
        <path class="rim" d={rounded(9, 9, 62, 62, z, 4)} />
        {#if i === 3}
          <path class="screen" d={rounded(14, 14, 52, 52, z, 4)} />
          <path class="detail" d={`M${point(14, 24, z)}L${point(66, 24, z)}`} />
          {#each [20, 25, 30] as dot (dot)}<circle class="ui-dot" cx={120 + dot - 19} cy={220 + (dot + 19) / 2 - z} r="1" />{/each}
          <path class="ui-tile" d={rounded(20, 31, 18, 27, z, 2)} />
          <path class="ui-tile" d={rounded(43, 31, 17, 13, z, 2)} />
          <path class="ui-selected" d={rounded(43, 49, 17, 9, z, 2)} />
        {:else if i === 2}
          <path class="routing" d={`M${point(40, 18, z)}L${point(58, 18, z)}Q${point(62, 18, z)} ${point(62, 22, z)}L${point(62, 40, z)}M${point(58, 35, z)}L${point(62, 40, z)}L${point(66, 35, z)}M${point(40, 62, z)}L${point(22, 62, z)}Q${point(18, 62, z)} ${point(18, 58, z)}L${point(18, 40, z)}M${point(14, 45, z)}L${point(18, 40, z)}L${point(22, 45, z)}`} />
          <path class="core-side" d={rounded(29, 29, 22, 22, z, 2)} />
          <path class="core-lit" d={`M${point(29, 29, z + 5)}L${point(29, 51, z + 5)}L${point(51, 51, z + 5)}L${point(51, 51, z)}L${point(29, 51, z)}L${point(29, 29, z)}Z`} />
          <path class="core-shade" d={`M${point(51, 29, z + 5)}L${point(51, 51, z + 5)}L${point(51, 51, z)}L${point(51, 29, z)}Z`} />
          <path class="core" d={rounded(29, 29, 22, 22, z + 5, 2)} />
          <path class="detail" d={`M${point(29, 51, z)}L${point(29, 51, z + 5)}M${point(51, 51, z)}L${point(51, 51, z + 5)}`} />
        {:else if i === 1}
          {#each [18, 40, 62] as x (x)}
            <path class="service-side" d={rounded(x - 7, 27, 14, 26, z, 2)} />
            <path class="service" d={rounded(x - 7, 27, 14, 26, z + 3, 2)} />
            {#if x === 18}<path class="service-glyph" d={`M${point(x, 32, z + 3)}L${point(x, 35, z + 3)}L${point(x - 3, 38, z + 3)}L${point(x + 3, 42, z + 3)}L${point(x, 46, z + 3)}L${point(x, 49, z + 3)}`} />
            {:else if x === 40}<path class="service-glyph" d={`M${point(x - 3, 34, z + 3)}L${point(x + 3, 34, z + 3)}L${point(x + 3, 46, z + 3)}L${point(x - 3, 46, z + 3)}ZM${point(x, 34, z + 3)}L${point(x, 46, z + 3)}`} />
            {:else}<path class="service-glyph" d={`M${point(x - 3, 34, z + 3)}L${point(x + 4, 40, z + 3)}L${point(x - 3, 46, z + 3)}Z`} />{/if}
          {/each}
        {:else}
          <path class="folder-back" d={`M${point(20, 29, z + 5)}L${point(20, 20, z + 5)}L${point(34, 20, z + 5)}L${point(40, 27, z + 5)}L${point(62, 27, z + 5)}L${point(62, 56, z + 5)}L${point(20, 56, z + 5)}Z`} />
          <path class="folder-side" d={`M${point(18, 33, z + 2)}L${point(64, 33, z + 2)}L${point(62, 60, z + 2)}L${point(62, 60, z)}L${point(18, 60, z)}Z`} />
          <path class="folder-front" d={`M${point(18, 33, z + 2)}L${point(64, 33, z + 2)}L${point(62, 60, z + 2)}L${point(18, 60, z + 2)}Z`} />
          <path class="folder-highlight" d={`M${point(21, 36, z + 2)}L${point(60, 36, z + 2)}`} />
        {/if}
        <path class="leader" d={`M204 ${cy}H238`} />
        <circle class="port" cx="201" {cy} r="1.8" />
        <text class="role" x="254" y={cy - 15}>{layer.role}</text>
        <text class="name" x="254" y={cy + 3}>{layer.name}</text>
        <text class="detail-label" x="254" y={cy + 20}>{layer.detail}</text>
      </g>
    {/each}
  </svg>
  <figcaption>Essentia analyzes the audio. Trigger.dev coordinates when that work runs.</figcaption>
</figure>

<style>
  .workflow-stack { max-width: 580px; margin-top: 18px; }
  svg { display: block; width: 100%; height: auto; }
  .guides { stroke: #ffffff24; stroke-width: .6; stroke-dasharray: 3 4; fill: none; }
  .top { fill: url(#stack-neutral-face); stroke: #b1b1b6; stroke-width: .7; stroke-linejoin: round; }
  .side { fill: #171719; stroke: #99999f; stroke-width: .7; stroke-linejoin: round; }
  .lit-side { fill: #303035; stroke: #99999f; stroke-width: .5; }
  .shade-side { fill: #1d1d21; stroke: #85858c; stroke-width: .5; }
  .grain { fill: #fff; opacity: .055; pointer-events: none; }
  .rim, .detail { fill: none; stroke: #92929a; stroke-width: .6; }
  .service-side { fill: #242427; stroke: #96969d; stroke-width: .5; }
  .service { fill: #424247; stroke: #aaaab1; stroke-width: .6; }
  .service-glyph { fill: none; stroke: #c1c1c7; stroke-width: .55; }
  .screen { fill: #232326; stroke: #8d8d94; stroke-width: .55; }
  .ui-dot { fill: #9e9ea5; }
  .ui-tile { fill: #35353a; stroke: #9999a0; stroke-width: .5; }
  .ui-selected { fill: #b4b4bc; stroke: #d3d3d8; stroke-width: .5; }
  .folder-back { fill: #797981; stroke: #c5c5cd; stroke-width: .6; stroke-linejoin: round; }
  .folder-front { fill: #515159; stroke: #b6b6bf; stroke-width: .6; stroke-linejoin: round; }
  .folder-side { fill: #333339; stroke: #9999a3; stroke-width: .5; }
  .folder-highlight { fill: none; stroke: #aaaab3; stroke-width: .6; }
  .focal .top { fill: url(#stack-orange-face); stroke: #e39158; }
  .focal .side { stroke: #a3470a; }
  .focal .lit-side { fill: #724427; stroke: #c17742; }
  .focal .shade-side { fill: #311d13; stroke: #a25a2c; }
  .focal .rim, .focal .detail { stroke: #a75d2b; }
  .core-side { fill: #a14d1a; stroke: #dc8244; stroke-width: .6; }
  .core-lit { fill: #c56c2d; stroke: #dc8244; stroke-width: .45; }
  .core-shade { fill: #8b3c13; stroke: #c16a30; stroke-width: .45; }
  .core { fill: url(#stack-orange-chip); stroke: #f2ab79; stroke-width: .6; }
  .routing { fill: none; stroke: #df9563; stroke-width: .85; stroke-linecap: round; stroke-linejoin: round; }
  .leader { fill: none; stroke: #73737a; stroke-width: .6; }
  .port { fill: #9999a0; }
  .focal .leader { stroke: #a75d2b; }
  .focal .port { fill: #e05c00; }
  .role { font-family: var(--font-mono); font-size: 8px; letter-spacing: .07em; fill: var(--color-zinc-500); }
  .focal .role { fill: #e05c00; }
  .name { font-family: var(--font-narrow); font-size: 16px; fill: var(--color-zinc-100); }
  .detail-label { font-family: var(--font-mono); font-size: 9px; fill: var(--color-zinc-400); }
  figcaption { margin-top: 8px; font-family: var(--font-mono); font-size: 10px; line-height: 1.6; color: var(--color-zinc-400); }
  @media (max-width: 639px) { .workflow-stack { margin-top: 12px; max-width: 360px; } figcaption { font-size: 9px; } }
</style>
