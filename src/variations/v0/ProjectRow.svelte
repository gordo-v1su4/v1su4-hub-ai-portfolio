<script lang="ts">
  import { slide } from "svelte/transition";
  import type { Project } from "../../data/projects";
  import { reduceMotion } from "../../lib/router.svelte";
  let { project, number, detail = false }: { project: Project; number: string; detail?: boolean } = $props();
  let active = $state(false);
  const shown = $derived(detail || active);
</script>

<article class="v0-project" class:active={shown}>
  <button class="v0-project-toggle" onclick={() => active = !active} aria-expanded={shown} aria-controls="v0-content-{project.slug}" disabled={detail}>
    <span class="v0-title-group"><span class="v0-number">{number}</span><span class="v0-project-title">{project.title}</span></span>
    <span class="v0-type">{project.type}</span>
    {#if !detail}<span class="v0-plus" aria-hidden="true">+</span>{/if}
  </button>
  {#if shown}
    <div id="v0-content-{project.slug}" transition:slide={{ duration: reduceMotion() ? 0 : 650 }}>
      <div class="v0-project-body">
        <a class="v0-media" class:natural={project.imageFit === "contain"} href={detail ? project.link ?? `#/work/${project.slug}` : `#/work/${project.slug}`} aria-label="View {project.title}" target={detail && project.link ? "_blank" : undefined} rel="noopener">
          <img src={project.cover} alt="{project.title} project preview" loading="lazy" />
          <span class="v0-media-action" aria-hidden="true">↗</span>
        </a>
        <div class="v0-info-grid">
          <section>
            <h4 class="v0-label red"><span class="v0-dot"></span>{project.type}</h4>
            <h5>{project.tagline}</h5>
            <p>{project.what}</p>
            <div class="v0-actions"><a href={`#/work/${project.slug}`}>View project ↗</a>{#if project.link}<a href={project.link} target="_blank" rel="noopener">Open app ↗</a>{/if}</div>
          </section>
          <div class="v0-divider" aria-hidden="true"></div>
          <section>
            <h4 class="v0-label"><span class="v0-dot"></span>How it works</h4>
            <h5>{project.role}</h5>
            <ol class="v0-flow">{#each project.flow as step (step.label)}<li><strong>{step.label}</strong><span>{step.sub}</span></li>{/each}</ol>
            <p class="v0-meta">{project.status} / {project.year}</p>
            <div class="v0-tags">{#each project.stack as tag (tag)}<span>{tag}</span>{/each}</div>
          </section>
        </div>
        {#if detail && project.media?.length}
          <div class="v0-gallery">{#each project.media as src, i (i)}<img {src} alt="{project.title} screenshot {i + 1}" loading="lazy" />{/each}</div>
        {/if}
      </div>
    </div>
  {/if}
</article>
