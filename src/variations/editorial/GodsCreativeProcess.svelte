<script lang="ts">
  import source from './diagrams/gods-creative-process.html?raw';
  // Trusted, versioned local HTML; no user content enters this SVG.
  const diagram = source.slice(source.indexOf('<svg'), source.indexOf('</svg>') + 6);
</script>

<section class="mt-14 lg:mt-20" aria-labelledby="gods-creative-heading">
  <p class="label text-zinc-500">The creative process</p>
  <h2 id="gods-creative-heading" class="mt-3 font-narrow font-semibold text-[26px] text-zinc-100 sm:text-[32px]">From world to show.</h2>
  <p class="mt-3 max-w-2xl font-mono text-[13px] leading-relaxed text-zinc-400">Mythology becomes a visual language, then a connected live-show concept.</p>
  <!-- Keyboard focus lets users scroll this diagram with arrow keys. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div class="diagram-scroll mt-3" role="region" aria-label="Creative process diagram; scroll horizontally on smaller screens" tabindex="0">
    {@html diagram}
  </div>
</section>

<style>
  .diagram-scroll :global(.gg-name) { font-family: var(--font-narrow); font-weight: 500; font-size: 16px; letter-spacing: .06em; }
  .diagram-scroll :global(.gg-primary) { font-family: var(--font-narrow); font-weight: 500; font-size: 16px; letter-spacing: .02em; }
  .diagram-scroll :global(.gg-body) { font-family: var(--font-mono); font-size: 11px; }
  .diagram-scroll :global(.gg-meta) { font-family: var(--font-mono); font-size: 10px; letter-spacing: .06em; }
  .diagram-scroll :global(.gg-meta-red) { font-family: var(--font-mono); font-size: 10px; letter-spacing: .055em; fill: var(--project-accent, #f3263e); }
  .diagram-scroll { max-width: 100%; min-width: 0; overflow-x: auto; }
  .diagram-scroll :global(svg) { display: block; width: 100%; min-width: 1280px; max-width: 1280px; }
</style>
