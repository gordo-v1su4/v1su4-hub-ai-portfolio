<script lang="ts">
  let { slug }: { slug: string } = $props();
  const sources = import.meta.glob('./diagrams/*-workflow.html', { query: '?raw', import: 'default', eager: true }) as Record<string,string>;
  const diagram = $derived.by(() => {
    const source = sources[`./diagrams/${slug}-workflow.html`] ?? '';
    return source.slice(source.indexOf('<svg'),source.indexOf('</svg>')+6);
  });
</script>
<!-- Trusted, generated local SVG. No user input enters the raw markup. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="diagram-scroll" role="region" aria-label="Workflow diagram; scroll horizontally on smaller screens" tabindex="0">{@html diagram}</div>
<style>
  .diagram-scroll { max-width: 1100px; overflow-x: auto; margin-top: 18px; }
  .diagram-scroll :global(svg) { display: block; width: 1100px; min-width: 1100px; height: auto; }
  .diagram-scroll:focus-visible { outline: 1px solid var(--project-accent); outline-offset: 4px; }
</style>
