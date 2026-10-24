<script lang="ts">
  import type { Entry } from './data';

  let { steps }: { steps: Entry['flow'] } = $props();
  const surfaces = ['#292929', '#252525', '#222222', '#1e1e1e', '#1a1a1a', '#171717', '#141414', '#111111'];
  const tags = [['SONG', 'STEM', 'REFS', 'CLIPS'], ['TREATMENT', 'STORY PLAN'], ['TIMED CUTS'], ['CAPTIONS', 'FOOTAGE'], ['AI', 'GAP FILL'], ['STORY TIMELINE'], ['TRANSITIONS', 'LOOK'], ['FINAL MP4']];
  const icons = [
    'M12 3v12m-4-4 4 4 4-4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4',
    'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Zm0 0v6h6M8 13h8M8 17h5',
    'M4 4h16v16H4ZM12 4v16M4 12h16',
    'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',
    'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
    'M3 6h6v12H3ZM15 6h6v12h-6ZM9 12h6',
    'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6',
    'M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4',
  ];
  const summaries = ['Map beats and lyrics. Detect and caption clips.', 'Choose a treatment. Confirm the story plan.', 'Build timed source windows for each cut.', 'Select footage for each section and edit slot.', 'Fill coverage gaps or replace a shot.', 'Assemble approved shots into the timeline.', 'Shape transitions and the visual treatment.', 'Review the sequence. Render the final MP4.'];
  const positions = [2, 294, 586, 878, 878, 586, 294, 2];
  function lines(text: string): string[] {
    const result: string[] = [];
    for (const word of text.split(' ')) {
      const last = result.length - 1;
      if (last < 0 || result[last].length + word.length + 1 > 29) result.push(word);
      else result[last] += ` ${word}`;
    }
    return result;
  }
</script>

<figure class="stack-flow" aria-label="Eight-stage music-video production workflow">
  <div class="flow-intro"><span class="eyebrow">FROM SOURCE TO SEQUENCE</span><p>A song, a story, and your footage — connected through eight production stages.</p></div>
  <ol class="phase-strip" aria-label="Production phases"><li>Source &amp; analyze</li><li>Plan &amp; match</li><li>Generate &amp; assemble</li><li>Finish &amp; export</li></ol>
  <svg class="desktop-flow" viewBox="0 0 1300 440" role="img" aria-labelledby="stack-flow-title stack-flow-desc">
    <title id="stack-flow-title">Music-video production in eight stages</title>
    <desc id="stack-flow-desc">Ingest, Story, Split, and Match prepare the edit. Missing coverage goes to Generate; complete coverage goes directly to Join. Effects and Export finish the video.</desc>
    <defs>
      <marker id="stack-flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="currentColor" stroke-width="0.8" /></marker>
    </defs>
    <rect class="lane" x="0" y="44" width="1120" height="148" rx="12" />
    <rect class="lane" x="0" y="294" width="1120" height="148" rx="12" />
    <circle class="phase-dot" cx="5" cy="32" r="2" /><text class="phase" x="18" y="36">PREPARE &amp; PLAN</text>
    <circle class="phase-dot" cx="5" cy="286" r="2" /><text class="phase" x="18" y="290">ASSEMBLE &amp; FINISH</text>
    <g class="edges" marker-end="url(#stack-flow-arrow)">
      <path d="M240 112H290" /><path d="M532 112H582" /><path d="M824 112H874" />
      <path d="M1116 112H1250Q1258 112 1258 120V221" />
      <path d="M1258 259V354Q1258 362 1250 362H1120" />
      <path d="M1216 242H713Q705 242 705 250V306" />
      <path d="M878 362H828" /><path d="M586 362H536" /><path d="M294 362H244" />
    </g>
    <rect class="decision" x="1216" y="225" width="84" height="34" rx="10" />
    <text class="decision-label" x="1258" y="246" text-anchor="middle">GAPS?</text>
    <text class="edge-label" x="920" y="225" text-anchor="middle">No · use matched footage</text>
    <text class="edge-label" x="1274" y="300">Yes</text>
    {#each steps as step, i (step.label)}
      {@const x = positions[i]}
      {@const y = i < 4 ? 60 : 310}
      <g class:output={i === 7} class:generated={i === 4} style:--node-fill={surfaces[i]}>
        <rect class="node" {x} {y} width="238" height="104" rx="8" />
        <rect class="number-chip" x={x + 14} y={y + 11} width="26" height="20" rx="5" />
        <svg class="stage-icon" x={x + 196} y={y + 14} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d={icons[i]} /></svg>
        <text class="number" x={x + 21} y={y + 24}>{String(i + 1).padStart(2, '0')}</text>
        <text class="node-title" x={x + 50} y={y + 25}>{step.label}</text>
        <text class="description" x={x + 18} y={y + 48}>
          {#each lines(summaries[i]) as line, j (line)}<tspan x={x + 18} dy={j === 0 ? 0 : 17}>{line}</tspan>{/each}
        </text>
        {#each tags[i] as tag, j (tag)}
          {@const tagX = x + 18 + tags[i].slice(0, j).reduce((sum, item) => sum + item.length * 5 + 21, 0)}
          <rect class="tag-bg" x={tagX} y={y + 77} width={tag.length * 5 + 14} height="17" rx="4" />
          <text class="tag" x={tagX + 7} y={y + 88}>{tag}</text>
        {/each}
      </g>
    {/each}
  </svg>
  <ol class="mobile-flow">
    {#each steps as step, i (step.label)}
      <li class:output={i === 7} class:generated={i === 4} style:--node-fill={surfaces[i]}>
        <span class="number">{String(i + 1).padStart(2, '0')}</span>
        <div><h3><svg class="stage-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d={icons[i]} /></svg>{step.label}</h3><p>{summaries[i]}</p><div class="mobile-tags">{#each tags[i] as tag (tag)}<span>{tag}</span>{/each}</div></div>
        {#if i === 3}<aside><strong>Missing coverage?</strong><span>Yes → Generate · No → Join</span></aside>{/if}
      </li>
    {/each}
  </ol>
  <figcaption><span class="legend-line" aria-hidden="true"></span>Generation fills coverage gaps; complete footage moves straight to Join.</figcaption>
</figure>

<style>
  .stack-flow { --flow-accent: #e05c00; margin-top: 1.75rem; }
  .phase-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 3px; max-width: 1240px; padding: 0; margin: 18px 0 4px; list-style: none; }
  .phase-strip li { display: grid; place-items: center; min-height: 28px; padding: 6px 16px; background: #272727; clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%, 9px 50%); font-family: var(--font-mono); font-size: 9px; letter-spacing: .05em; text-transform: uppercase; color: var(--color-zinc-400); }
  .phase-strip li:first-child { background: #202020; clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); }
  .phase-strip li:nth-child(3) { background: #34271f; color: #d69a71; }
  .phase-strip li:last-child { background: #303030; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 9px 50%); }
  .flow-intro { display: flex; flex-wrap: wrap; align-items: baseline; gap: 12px 28px; }
  .eyebrow, .phase { font-family: var(--font-mono); font-size: 10px; letter-spacing: .12em; color: var(--color-zinc-400); fill: var(--color-zinc-400); }
  .flow-intro p, figcaption { font-family: var(--font-mono); font-size: 11px; line-height: 1.8; color: var(--color-zinc-400); }
  .desktop-flow { display: block; width: 100%; max-width: 1240px; height: auto; margin: 12px 0 0; overflow: visible; }
  .edges { fill: none; stroke: var(--color-zinc-500); color: var(--color-zinc-500); stroke-width: .8; }
  .lane { fill: #ffffff; fill-opacity: .012; }
  .phase-dot { fill: var(--flow-accent); }
  .number-chip { fill: #ffffff; fill-opacity: .06; }
  .output .number-chip { fill: var(--flow-accent); fill-opacity: .13; }
  .stage-icon { fill: none; stroke: var(--color-zinc-400); stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
  .tag-bg { fill: #ffffff; fill-opacity: .045; }
  .tag { font-family: var(--font-mono); font-size: 8px; letter-spacing: .03em; fill: var(--color-zinc-400); }
  .node { fill: var(--node-fill); stroke: #ffffff24; stroke-width: .5; }
  .output .node { stroke: #e05c0070; }
  .generated .node { stroke-dasharray: 4 4; stroke: var(--color-zinc-500); }
  .number { font-family: var(--font-mono); font-size: 10px; fill: var(--color-zinc-400); color: var(--color-zinc-400); }
  .output .number { fill: var(--flow-accent); color: var(--flow-accent); }
  .node-title { font-family: var(--font-narrow); font-size: 16px; font-weight: 500; letter-spacing: .06em; fill: var(--color-zinc-100); }
  .description { font-family: var(--font-mono); font-size: 11px; fill: var(--color-zinc-400); }
  .decision { fill: var(--color-ink); stroke: var(--color-zinc-500); stroke-width: .75; }
  .decision-label, .edge-label { font-family: var(--font-mono); font-size: 10px; fill: var(--color-zinc-400); }
  figcaption { display: flex; align-items: baseline; gap: 10px; }
  .legend-line { width: 20px; flex-shrink: 0; border-top: .5px dashed var(--color-zinc-500); transform: translateY(-3px); }
  .mobile-flow { display: none; }
  @media (max-width: 899px) {
    .phase-strip { margin-top: 12px; gap: 2px; }
    .phase-strip li { grid-template-columns: none; gap: 0; min-height: 28px; padding: 5px 9px; border: 0; border-radius: 0; font-size: 7px; line-height: 1.5; text-align: center; }
    .phase-strip li::after { display: none; }
    .desktop-flow { display: none; }
    .stack-flow { margin-top: 16px; }
    .flow-intro { gap: 6px; }
    .flow-intro p, figcaption { font-size: 10px; line-height: 1.5; }
    .mobile-flow { display: grid; gap: 14px; margin: 14px 0; padding: 0; list-style: none; }
    li { display: grid; grid-template-columns: 16px minmax(0, 1fr); position: relative; gap: 8px; padding: 10px 12px; border: .5px solid var(--color-line-2); border-radius: 6px; background: var(--color-ink-2); }
    li:not(:last-child)::after { content: '↓'; position: absolute; left: 17px; top: 100%; height: 14px; line-height: 14px; font-size: 10px; color: var(--color-zinc-500); }
    li.output { border-color: #e05c0070; }
    li.generated { border-style: dashed; }
    .mobile-flow > li { background: var(--node-fill); }
    .number { padding-top: 3px; font-size: 9px; }
    .stage-icon { width: 15px; height: 15px; }
    h3 { display: flex; align-items: center; gap: 7px; font-family: var(--font-narrow); font-size: 13px; font-weight: 500; letter-spacing: .06em; color: var(--color-zinc-100); }
    li p { margin-top: 4px; font-family: var(--font-mono); font-size: 10px; line-height: 1.5; color: var(--color-zinc-400); }
    .mobile-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
    .mobile-tags span { padding: 2px 5px; border-radius: 3px; background: #ffffff09; font-family: var(--font-mono); font-size: 8px; color: var(--color-zinc-400); }
    aside { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 0; padding-top: 7px; border-top: .5px solid var(--color-line-2); font-family: var(--font-mono); font-size: 9px; line-height: 1.5; color: var(--color-zinc-400); }
    aside strong { font-weight: 400; color: var(--color-zinc-100); }
  }
</style>
