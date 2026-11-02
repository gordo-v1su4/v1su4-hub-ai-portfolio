<script lang="ts">
  let { slug, scaled = false }: { slug: string; scaled?: boolean } = $props();
  const loaders = import.meta.glob('./diagrams/*-workflow.html', {
    query: '?raw',
    import: 'default',
  }) as Record<string, () => Promise<string>>;

  let diagram = $state('');

  $effect(() => {
    const key = `./diagrams/${slug}-workflow.html`;
    const load = loaders[key];
    if (!load) {
      diagram = '';
      return;
    }
    let cancelled = false;
    void load().then((source) => {
      if (cancelled) return;
      const start = source.indexOf('<svg');
      const end = source.indexOf('</svg>') + 6;
      diagram = start >= 0 && end > start ? source.slice(start, end) : '';
    });
    return () => {
      cancelled = true;
    };
  });
</script>
<!-- Trusted generated local SVG (regen via build-project-diagrams). -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="diagram-fit" class:scaled role="img" aria-label="Workflow diagram">{@html diagram}</div>
<style>
  .diagram-fit { width: 100%; max-width: 1100px; margin-top: 18px; overflow: visible; }
  .diagram-fit :global(svg) {
    display: block;
    width: 100%;
    height: auto;
    max-width: 100%;
    vertical-align: top;
  }
  /* Focal slides: match chevron strip teals, not full-brightness accent */
  .diagram-fit:not(.scaled) :global(.node-name) {
    font-family: var(--font-narrow);
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .diagram-fit:not(.scaled) :global(.node-detail) {
    font-size: 10px;
  }
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
</style>
