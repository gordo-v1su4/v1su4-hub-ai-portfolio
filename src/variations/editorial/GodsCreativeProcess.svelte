<script lang="ts">
  import source from './diagrams/gods-gatekeepers-workflow.html?raw';
  const diagram = source.slice(source.indexOf('<svg'), source.indexOf('</svg>') + 6);
  const phases = ['Worldbuilding', 'Visual development', 'Show concept'];
</script>

<section class="mt-14 lg:mt-20" aria-labelledby="gods-creative-heading">
  <p class="label text-zinc-500">The creative process</p>
  <h2 id="gods-creative-heading" class="mt-3 font-narrow font-semibold text-[26px] text-zinc-100 sm:text-[32px]">From world to show.</h2>
  <p class="mt-3 max-w-2xl font-mono text-[13px] leading-relaxed text-zinc-400">Mythology becomes a visual language, then a connected live-show concept.</p>
  <figure class="gods-flow">
    <div class="workflow-visual">
      <div class="workflow-scale-shell">
        <div class="workflow-artboard">
          <ul class="phase-strip" aria-label="Creative stages" style="--phase-count: {phases.length}">
            {#each phases as phase, i (phase)}
              <li class:last={i === phases.length - 1} class:mid={i === phases.length - 2} style="--phase-i: {i}">{phase}</li>
            {/each}
          </ul>
          <div class="diagram-fit" role="img" aria-label="Creative process, from worldbuilding to show concept">
            {@html diagram}
          </div>
        </div>
      </div>
    </div>
  </figure>
</section>

<style>
  .gods-flow { width: 100%; max-width: 1100px; margin: 22px 0 0; }
  .workflow-visual { width: 100%; min-width: 0; container-type: inline-size; }
  .workflow-scale-shell {
    position: relative;
    width: 100%;
    height: calc(466px * (100cqw / 1100px));
    overflow: hidden;
  }
  .workflow-artboard {
    position: absolute;
    top: 0;
    left: 0;
    width: 1100px;
    transform: scale(calc(100cqw / 1100px));
    transform-origin: top left;
  }
  .diagram-fit :global(svg) { display: block; width: 1100px; height: auto; }
  .diagram-fit :global(.node-name) {
    font-family: var(--font-narrow);
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .diagram-fit :global(.focal .node-name) {
    fill: color-mix(in srgb, var(--project-accent) 45%, var(--color-zinc-300));
  }
  .diagram-fit :global(.focal .node-detail) {
    fill: color-mix(in srgb, var(--project-accent) 18%, var(--color-zinc-400));
  }
  .phase-strip {
    display: flex;
    flex-wrap: nowrap;
    gap: 3px;
    padding: 0;
    margin: 0 0 18px;
    list-style: none;
    width: 1100px;
  }
  .phase-strip li {
    flex: 1 1 0;
    min-width: 0;
    display: grid;
    place-items: center;
    height: 32px;
    padding: 0 18px;
    background: color-mix(in srgb, var(--project-accent) calc(10% + (var(--phase-i) / max(1, var(--phase-count) - 1)) * 18%), #272727);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%);
    font: 11px/1 var(--font-mono);
    color: color-mix(in srgb, var(--project-accent) 42%, var(--color-zinc-300));
    text-align: center;
    text-transform: uppercase;
    letter-spacing: .08em;
    white-space: nowrap;
  }
  .phase-strip li:first-child {
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
    background: color-mix(in srgb, var(--project-accent) 8%, #202020);
    color: color-mix(in srgb, var(--project-accent) 28%, var(--color-zinc-400));
  }
  .phase-strip li.mid {
    background: color-mix(in srgb, var(--project-accent) 22%, #2a181c);
    color: color-mix(in srgb, var(--project-accent) 55%, var(--color-zinc-200));
  }
  .phase-strip li.last {
    background: color-mix(in srgb, var(--project-accent) 28%, #301418);
    color: color-mix(in srgb, var(--project-accent) 62%, var(--color-zinc-100));
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 10px 50%);
  }
</style>
