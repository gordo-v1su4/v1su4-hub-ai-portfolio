<script lang="ts">
  import type { CaseStudy } from './caseStudies';
  let { architecture }: { architecture: CaseStudy['architecture'] } = $props();
  const pitch = 136;
  const height = $derived(architecture.nodes.length * pitch + 8);
  function point(x: number, y: number, cy: number, lift = 0) { return `${140 + x - y},${cy - 60 + (x + y) / 2 - lift}`; }
  function rect(x: number, y: number, w: number, h: number, cy: number, lift = 0) { return `M${point(x,y,cy,lift)}L${point(x+w,y,cy,lift)}L${point(x+w,y+h,cy,lift)}L${point(x,y+h,cy,lift)}Z`; }
  function design(id: string, name: string) {
    if (id === 'shell') return 'desktop';
    if (/PlaybackCoordinator|VideoPool/.test(name)) return 'film';
    if (/storage|media|catalog|db|review/.test(id)) return 'storage';
    if (/audio|analysis|intelligence|schedule/.test(id)) return 'wave';
    if (/render|domain|jobs|api/.test(id)) return 'chip';
    if (/prepare|processing|providers|automation|workers|generation|sources/.test(id)) return 'routes';
    if (/output|assembly|results|delivery|external/.test(id)) return 'output';
    if (/decode|adapters|preview/.test(id)) return 'film';
    return 'interface';
  }
</script>

<figure class="connected-stack" aria-label={architecture.label}>
  <figcaption>{architecture.intro}</figcaption>
  <div class="stack-layout">
    <svg viewBox={`0 0 300 ${height}`} role="img" aria-labelledby="connected-stack-title connected-stack-desc">
      <title id="connected-stack-title">{architecture.label}</title>
      <desc id="connected-stack-desc">One exploded stack with a shared footprint; each layer has its own surface design and an aligned description of its role.</desc>
      <defs>
        <linearGradient id="connected-neutral-face" x1="0" y1="0" x2="0.8" y2="1"><stop stop-color="#3b3b40"/><stop offset="1" stop-color="#29292d"/></linearGradient>
        <linearGradient id="connected-accent-face" x1="0" y1="0" x2="0.8" y2="1"><stop class="accent-stop"/><stop offset="1" class="accent-stop-end"/></linearGradient>
      </defs>
      <path class="guides" d={`M20 68V${height-68}M260 68V${height-68}`} />
      {#each [...architecture.nodes].reverse() as node, reverseIndex (node.id)}
        {@const i = architecture.nodes.length - 1 - reverseIndex}
        {@const cy = i * pitch + 68}
        {@const motif = design(node.id, node.name)}
        <g class:focal={node.accent} class:pending={node.pending}>
          <path class="side" d={`M20 ${cy}L140 ${cy+60}L260 ${cy}V${cy+8}L140 ${cy+68}L20 ${cy+8}Z`}/>
          <path class="face" d={rect(0,0,120,120,cy)} />
          <path class="rim" d={rect(10,10,100,100,cy)} />
          {#if motif === 'desktop'}
            <path class="panel" d={rect(26,18,68,54,cy)} /><path class="tile" d={rect(32,24,56,42,cy)} />
            <path class="detail" d={`M${point(60,72,cy)}L${point(60,84,cy)}M${point(40,84,cy)}L${point(80,84,cy)}`} />
            <path class="panel" d={rect(30,94,60,12,cy)} />
          {:else if motif === 'interface'}
            <path class="panel" d={rect(22,22,76,76,cy)} />
            <path class="detail" d={`M${point(22,38,cy)}L${point(98,38,cy)}`} />
            <path class="tile" d={rect(28,46,27,42,cy)} /><path class="tile" d={rect(62,46,28,18,cy)} /><path class="highlight" d={rect(62,72,28,16,cy)} />
          {:else if motif === 'wave'}
            <path class="panel" d={rect(22,26,76,68,cy)} />
            {#each [34,42,50,58,66,74,82,90] as x, j (x)}
              <path class="signal" d={`M${point(x,60-[10,18,30,22,12,26,18,8][j],cy)}L${point(x,60+[10,18,30,22,12,26,18,8][j],cy)}`} />
            {/each}
          {:else if motif === 'chip'}
            <path class="panel" d={rect(32,32,56,56,cy)} /><path class="highlight" d={rect(44,44,32,32,cy,5)} />
            {#each [42,54,66,78] as n (n)}<path class="detail" d={`M${point(n,20,cy)}L${point(n,32,cy)}M${point(n,88,cy)}L${point(n,100,cy)}M${point(20,n,cy)}L${point(32,n,cy)}M${point(88,n,cy)}L${point(100,n,cy)}`} />{/each}
          {:else if motif === 'storage'}
            {#each [14,40,66] as y (y)}<path class="panel" d={rect(30,y+8,60,24,cy,3)} /><path class="detail" d={`M${point(38,y+15,cy,3)}L${point(72,y+15,cy,3)}M${point(38,y+23,cy,3)}L${point(60,y+23,cy,3)}`} />{/each}
          {:else if motif === 'routes'}
            <path class="detail" d={`M${point(30,30,cy)}L${point(60,30,cy)}L${point(60,90,cy)}L${point(90,90,cy)}M${point(30,90,cy)}L${point(45,90,cy)}L${point(45,60,cy)}L${point(90,60,cy)}`} />
            {#each [[24,24],[24,84],[84,54],[84,84]] as pair (pair)}<path class="tile" d={rect(pair[0],pair[1],12,12,cy,3)} />{/each}
            <path class="highlight" d={rect(51,21,18,18,cy,4)} />
          {:else if motif === 'film'}
            {#each [20,48,76] as x (x)}<path class="panel" d={rect(x,24,24,72,cy)} /><path class="tile" d={rect(x+4,34,16,24,cy)} /><path class="tile" d={rect(x+4,66,16,20,cy)} />{/each}
          {:else}
            <path class="panel" d={rect(26,24,68,72,cy)} /><path class="highlight" d={`M${point(48,40,cy,3)}L${point(76,60,cy,3)}L${point(48,80,cy,3)}Z`} />
            <path class="detail" d={`M${point(34,88,cy)}L${point(86,88,cy)}`} />
          {/if}
          <path class="leader" d={`M264 ${cy}H296`} /><circle class="port" cx="261" {cy} r="2" />
        </g>
      {/each}
    </svg>
    <ul class="layers">
      {#each architecture.nodes as node (node.id)}
        <li class:focal={node.accent} class:pending={node.pending}>
          <p class="role">{node.role}</p><h3>{node.name}</h3><p class="description">{node.body}</p>
          <ul class="parts">{#each node.parts as part (part)}<li>{part}</li>{/each}</ul>
        </li>
      {/each}
    </ul>
  </div>
  <div class="connections"><span>System connections</span><ul>{#each architecture.connections as connection (connection)}<li>{connection}</li>{/each}</ul></div>
</figure>

<style>
  .connected-stack { margin-top: 24px; max-width: 1040px; }
  figcaption { max-width: 90ch; font: 11px/1.8 var(--font-mono); color: var(--color-zinc-400); }
  .stack-layout { display: grid; grid-template-columns: 300px minmax(0,1fr); gap: 20px; margin-top: 28px; }
  svg { width: 300px; height: auto; display: block; }
  .guides { fill: none; stroke: #ffffff40; stroke-width: .7; stroke-dasharray: 3 4; }
  .face { fill: url(#connected-neutral-face); stroke: #b1b1b6; stroke-width: .7; }
  .side { fill: #171719; stroke: #99999f; stroke-width: .7; }
  .rim, .detail { fill: none; stroke: #92929a; stroke-width: .8; }
  .panel { fill: #232326; stroke: #8d8d94; stroke-width: .7; }
  .tile { fill: #35353a; stroke: #b1b1b6; stroke-width: .7; }
  .highlight { fill: #a1a1aa; stroke: #d3d3d8; stroke-width: .7; }
  .signal { fill: none; stroke: #c9c9cf; stroke-width: 1.3; }
  .leader { fill: none; stroke: #73737a; stroke-width: .7; }
  .port { fill: #a1a1aa; }
  .accent-stop { stop-color: color-mix(in srgb,var(--project-accent) 38%,#3b3b40); }
  .accent-stop-end { stop-color: color-mix(in srgb,var(--project-accent) 20%,#29292d); }
  .focal .face { fill: url(#connected-accent-face); stroke: var(--project-accent); }
  .focal .highlight, .focal .port { fill: var(--project-accent); }
  .focal .leader { stroke: var(--project-accent); }
  .pending .face { stroke-dasharray: 4 3; }
  .layers { padding: 0; margin: 0; list-style: none; }
  .layers > li { min-height: 136px; display: flex; flex-direction: column; justify-content: center; }
  .role { font: 10px/1.5 var(--font-mono); color: var(--color-zinc-400); text-transform: uppercase; letter-spacing: .04em; }
  h3 { margin-top: 3px; font: 500 16px/1.3 var(--font-narrow); color: var(--color-zinc-100); }
  .focal .role, .focal h3 { color: var(--project-accent); }
  .description { margin-top: 6px; font: 11px/1.7 var(--font-mono); color: var(--color-zinc-400); }
  .parts { display: flex; flex-wrap: wrap; gap: 3px 12px; padding: 0; margin: 7px 0 0; list-style: none; font: 10px/1.5 var(--font-mono); color: var(--color-zinc-400); }
  .connections { border-top: .5px dashed #ffffff30; margin-top: 24px; padding-top: 16px; font: 10px/1.8 var(--font-mono); color: var(--color-zinc-400); }
  .connections ul { margin-top: 8px; list-style: none; padding: 0; }
  @media (max-width: 899px) {
    .stack-layout { grid-template-columns: 1fr; }
    svg { margin-inline: auto; max-width: 100%; max-height: 720px; }
    .layers { display: grid; gap: 18px; }
    .layers > li { min-height: 0; padding-bottom: 18px; border-bottom: .5px solid #ffffff20; }
  }
</style>
