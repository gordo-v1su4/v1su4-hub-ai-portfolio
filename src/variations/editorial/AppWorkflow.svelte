<script lang="ts">
  import type { CaseStudy } from './caseStudies';
  import { workflowDiagrams } from './diagramData';
  import ProjectDiagram from './ProjectDiagram.svelte';
  let { study, slug }: { study: CaseStudy; slug: string } = $props();
  const diagramHeight = $derived(workflowDiagrams[slug]?.height ?? 456);
</script>

<figure class="app-workflow" aria-label="Project workflow">
  <figcaption>{study.intro}</figcaption>
  <div class="workflow-visual" style="--diagram-h: {diagramHeight}px">
    <div class="workflow-scale-shell">
      <div class="workflow-artboard">
        <ul class="phase-strip" aria-label="Workflow phases" style="--phase-count: {study.phases.length}">
          {#each study.phases as phase, i (phase)}
            <li class:last={i === study.phases.length - 1} class:mid={i === study.phases.length - 2} style="--phase-i: {i}">{phase}</li>
          {/each}
        </ul>
        <ProjectDiagram {slug} scaled />
      </div>
    </div>
  </div>
</figure>

<style>
  .app-workflow { margin: 24px 0 0; width: 100%; max-width: 1100px; }
  .workflow-visual {
    width: 100%;
    min-width: 0;
    max-width: 1100px;
    container-type: inline-size;
  }
  /* One 1100px artboard: chevrons + SVG scale together (no width-only SVG squash). */
  .workflow-scale-shell {
    position: relative;
    width: 100%;
    height: calc((60px + 18px + var(--diagram-h)) * (100cqw / 1100px));
    overflow: hidden;
  }
  .workflow-artboard {
    position: absolute;
    top: 0;
    left: 0;
    width: 1100px;
    transform: scale(calc(100cqw / 1100px));
    transform-origin: top left;
    will-change: transform;
  }
  .workflow-artboard :global(.diagram-fit) {
    width: 1100px;
    max-width: none;
    margin-top: 18px;
  }
  .workflow-artboard :global(.diagram-fit svg) {
    width: 1100px;
    max-width: none;
    height: auto;
  }
  figcaption { max-width: 90ch; font: 11px/1.8 var(--font-mono); color: var(--color-zinc-400); }
  .phase-strip {
    display: flex;
    flex-wrap: nowrap;
    gap: 3px;
    padding: 0;
    margin: 22px 0 12px;
    list-style: none;
    width: 1100px;
  }
  .phase-strip li {
    flex: 1 1 0;
    min-width: 0;
    display: grid;
    place-items: center;
    height: 26px;
    padding: 0 14px;
    background: color-mix(in srgb, var(--project-accent) calc(8% + (var(--phase-i) / max(1, var(--phase-count) - 1)) * 16%), #272727);
    clip-path: polygon(0 0,calc(100% - 9px) 0,100% 50%,calc(100% - 9px) 100%,0 100%,9px 50%);
    font: 9px/1.2 var(--font-mono);
    color: color-mix(in srgb, var(--project-accent) 18%, var(--color-zinc-400));
    text-align: center;
    text-transform: uppercase;
    letter-spacing: .05em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .phase-strip li:first-child { clip-path: polygon(0 0,calc(100% - 9px) 0,100% 50%,calc(100% - 9px) 100%,0 100%); background: color-mix(in srgb, var(--project-accent) 6%, #202020); }
  .phase-strip li.mid { background: color-mix(in srgb, var(--project-accent) 24%, #2a2520); color: color-mix(in srgb, var(--project-accent) 45%, var(--color-zinc-300)); }
  .phase-strip li.last {
    background: color-mix(in srgb, var(--project-accent) 20%, #303030);
    color: color-mix(in srgb, var(--project-accent) 55%, var(--color-zinc-200));
    clip-path: polygon(0 0,100% 0,100% 100%,0 100%,9px 50%);
  }
</style>
