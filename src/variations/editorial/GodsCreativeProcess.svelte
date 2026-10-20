<script lang="ts">
  import source from './gods-creative-process.html?raw';
  // Trusted, versioned local HTML; no user content enters this SVG.
  const diagram = source.slice(source.indexOf('<svg'), source.indexOf('</svg>') + 6);
</script>

<section class="mt-14 lg:mt-20" aria-labelledby="gods-creative-heading">
  <p class="label text-zinc-500">The creative process</p>
  <h2 id="gods-creative-heading" class="mt-3 font-narrow text-[26px] font-semibold text-zinc-100 sm:text-[32px]">From world to show.</h2>
  <p class="mt-3 max-w-2xl font-sans text-[13px] leading-relaxed text-zinc-400">Mythology becomes a visual language, then a connected live-show concept.</p>
  <!-- Keyboard focus lets users scroll this diagram with arrow keys. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div class="diagram-scroll mt-3" role="region" aria-label="Creative process diagram; scroll horizontally on smaller screens" tabindex="0">
    {@html diagram}
  </div>
</section>

<style>
  .diagram-scroll { max-width: 100%; min-width: 0; overflow-x: auto; }
  .diagram-scroll :global(svg) { display: block; width: 100%; min-width: 1280px; }
</style>
