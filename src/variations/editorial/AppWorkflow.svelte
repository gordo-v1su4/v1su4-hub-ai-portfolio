<script lang="ts">
  import type { CaseStudy } from './caseStudies';
  import ProjectDiagram from './ProjectDiagram.svelte';
  let { study, slug }: { study: CaseStudy; slug: string } = $props();
</script>

<figure class="app-workflow" aria-label="Project workflow">
  <figcaption>{study.intro}</figcaption>
  <ul class="phase-strip" aria-label="Workflow phases">
    {#each study.phases as phase (phase)}<li>{phase}</li>{/each}
  </ul>
  <ProjectDiagram {slug} />
  <details class="microprocesses">
    <summary>Detailed stages &amp; micro-processes</summary>
  {#each study.lanes as lane (lane.label)}
    <div class="workflow-lane" class:parallel={lane.mode === 'parallel'}>
      <span class="lane-label">{lane.label}</span>
      <div class="lane-content">
        {#if lane.mode === 'parallel' && lane.cards.length > 1}<p class="branch-label">Parallel paths / shared context</p>{/if}
        <ul class="cards" style:--columns={Math.min(lane.cards.length, 3)}>
          {#each lane.cards as card (card.title)}
            <li class:accent={card.accent} class:pending={card.pending}>
              <h3>{card.title}</h3><p>{card.body}</p>
              {#if card.tags?.length}<ul class="tags">{#each card.tags as tag (tag)}<li>{tag}</li>{/each}</ul>{/if}
            </li>
          {/each}
        </ul>
        {#if lane.note}<p class="lane-note">{lane.note}</p>{/if}
      </div>
    </div>
  {/each}
  </details>
</figure>

<style>
  .app-workflow { margin: 24px 0 0; max-width: 1100px; }
  .microprocesses { margin-top: 18px; border-top: .5px solid #ffffff24; }
  summary { padding: 14px 0; cursor: pointer; font: 11px/1.8 var(--font-mono); color: var(--color-zinc-400); }
  summary::marker { color: var(--project-accent); }
  summary:focus-visible { outline: 1px solid var(--project-accent); }
  figcaption { max-width: 90ch; font: 11px/1.8 var(--font-mono); color: var(--color-zinc-400); }
  .phase-strip { display: flex; gap: 3px; padding: 0; margin: 22px 0 12px; list-style: none; }
  .phase-strip li { flex: 1; display: grid; place-items: center; padding: 6px 16px; background: #272727; clip-path: polygon(0 0,calc(100% - 9px) 0,100% 50%,calc(100% - 9px) 100%,0 100%,9px 50%); font: 10px/1.5 var(--font-mono); color: var(--color-zinc-400); text-align: center; text-transform: uppercase; letter-spacing: .05em; }
  .workflow-lane { position: relative; display: grid; grid-template-columns: 24px minmax(0,1fr); gap: 14px; padding: 22px 0; }
  .workflow-lane:not(:last-child)::after { content: '↓'; position: absolute; left: 47px; bottom: -10px; z-index: 1; font: 12px var(--font-mono); color: var(--color-zinc-500); }
  .lane-label { writing-mode: vertical-rl; transform: rotate(180deg); align-self: center; justify-self: start; font: 10px var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--color-zinc-400); }
  .lane-content { min-width: 0; }
  .cards { display: grid; grid-template-columns: repeat(var(--columns), minmax(0,1fr)); gap: 24px; padding: 0; margin: 0; list-style: none; }
  .cards > li { min-width: 0; position: relative; padding: 12px 14px; border: .5px solid #ffffff24; border-radius: 6px; background: #222222; }
  .cards > li:not(:first-child)::before { content: '→'; position: absolute; right: calc(100% + 6px); top: 20px; font: 11px var(--font-mono); color: var(--color-zinc-500); }
  .cards > li:nth-child(3n+1)::before { display: none; }
  .parallel .cards { position: relative; padding-top: 14px; }
  .parallel .cards::before { content: ''; position: absolute; top: 0; left: 14px; right: 14px; border-top: .5px solid #ffffff30; }
  .parallel .cards > li::before { display: block; content: ''; top: -14px; height: 14px; left: 14px; right: auto; border-left: .5px solid #ffffff30; }
  .cards > li.accent { border-color: color-mix(in srgb,var(--project-accent) 50%,transparent); background: #141414; }
  .cards > li.pending { border-style: dashed; background: #111; }
  h3 { font: 500 15px/1.3 var(--font-narrow); letter-spacing: .045em; text-transform: uppercase; color: var(--color-zinc-100); }
  .accent h3 { color: var(--project-accent); }
  .cards p { margin-top: 9px; max-width: 65ch; font: 11px/1.8 var(--font-mono); color: var(--color-zinc-400); }
  .tags { display: flex; flex-wrap: wrap; gap: 4px; padding: 0; margin: 13px 0 0; list-style: none; }
  .tags li { padding: 3px 6px; border-radius: 3px; background: #ffffff08; color: var(--color-zinc-400); font: 10px/1.5 var(--font-mono); }
  .branch-label { margin-bottom: 10px; font: 10px/1.5 var(--font-mono); color: var(--color-zinc-400); letter-spacing: .06em; }
  .lane-note { margin-top: 16px; padding-left: 12px; max-width: 100ch; border-left: 1px dashed #ffffff30; font: 10px/1.8 var(--font-mono); color: var(--color-zinc-400); }
  @media (max-width: 899px) {
    .workflow-lane { grid-template-columns: 16px minmax(0,1fr); gap: 8px; }
    .phase-strip { flex-wrap: wrap; }
    .phase-strip li { flex-basis: 40%; padding: 7px 10px; font-size: 10px; }
    .cards { grid-template-columns: 1fr; gap: 20px; }
    .cards > li { padding: 14px; }
    .cards > li:not(:first-child)::before { display: block; content: '↓'; left: 14px; right: auto; top: -20px; line-height: 20px; }
    .parallel .cards { padding: 0 0 0 12px; border-left: .5px solid #ffffff30; }
    .parallel .cards::before { display: none; }
    .parallel .cards > li::before { display: block; content: ''; top: 18px; left: -13px; width: 12px; height: 0; border-left: 0; border-top: .5px solid #ffffff30; }
    .workflow-lane:not(:last-child)::after { left: 32px; }
    h3 { font-size: 13px; }
    .cards p { font-size: 11px; line-height: 1.6; }
  }
</style>
