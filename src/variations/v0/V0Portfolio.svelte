<script lang="ts">
  import { onMount, tick } from "svelte";
  import { slide } from "svelte/transition";
  import { labItems, portfolioProjects, site, skillGroups } from "../../data/projects";

  const projects = portfolioProjects();
  import { gsap } from "../../lib/gsap";
  import { go, reduceMotion, type Route } from "../../lib/router.svelte";
  import ProjectRow from "./ProjectRow.svelte";
  import "./v0.css";
  let { route }: { route: Route } = $props();
  let root: HTMLElement;
  let openLab = $state<string | null>(null);
  const project = $derived(projects.find(p => p.slug === route.slug));
  const lab = $derived(labItems.find(p => p.slug === route.slug));

  onMount(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".v0-hero-line", { y: 200, opacity: 0, stagger: 0.1, duration: 1.2, ease: "power4.out" });
      gsap.from(".v0-hero-sub", { opacity: 0, duration: 1, delay: 0.7 });
    }, root);
    return () => ctx.revert();
  });

  async function scrollToSection(event: MouseEvent, id: string) {
    event.preventDefault();
    if (route.view !== "home") {
      await new Promise<void>(resolve => {
        window.addEventListener("hashchange", () => resolve(), { once: true });
        go("/");
      });
      await tick();
    }
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? "instant" : "smooth" });
  }
</script>

<div class="v0-site" bind:this={root}>
  <div class="v0-noise" aria-hidden="true"></div>
  <nav class="v0-navigation" aria-label="Main navigation">
    <a href="#/" onclick={event => { event.preventDefault(); go("/"); }} class="v0-brand">{site.label}</a>
    <div class="v0-nav-links">
      <a href="#/" onclick={e => scrollToSection(e, "work")}>Portfolio</a>
      <a href="#/lab">Lab</a>
      <a href="#/about">Archives</a>
      <span>{site.base.replace(" / ", " // ")}</span>
    </div>
  </nav>
  <main>
    {#if route.view === "home"}
      <header class="v0-hero">
        <div class="v0-hero-heading"><div class="v0-hero-mask"><h1 class="v0-hero-line">Creative</h1></div><div class="v0-hero-mask"><p class="v0-hero-line v0-gradient">Technologist</p></div></div>
        <div class="v0-hero-sub"><p>{site.mission} • {site.base}</p><span class="v0-red-line"></span></div>
      </header>
      <section id="work" class="v0-work">
        <header class="v0-section-heading"><div><span class="v0-eyebrow">Selected Works</span><h2>AI production<br />& creative tools</h2></div><span class="v0-heading-rule"></span></header>
        <div class="v0-project-list">{#each projects as p, i (p.slug)}<ProjectRow project={p} number={`${String(i + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`} />{/each}</div>
      </section>
    {:else if route.view === "project"}
      <section class="v0-work v0-detail"><a href="#/" class="v0-back">← Portfolio</a>{#if project}<ProjectRow {project} number={`${project.year}`} detail />{:else}<h2>Project not found</h2>{/if}</section>
    {:else if route.view === "lab" || route.view === "lab-project"}
      <section class="v0-work v0-detail">
        <header class="v0-section-heading"><div><span class="v0-eyebrow">In progress / Experimental</span><h2>Lab</h2></div><span class="v0-heading-rule"></span></header>
        <div class="v0-project-list">
          {#each (route.view === "lab-project" ? lab ? [lab] : [] : labItems) as l, i (l.slug)}
            <article class="v0-project" class:active={openLab === l.slug || route.view === "lab-project"}>
              <button class="v0-project-toggle" aria-expanded={openLab === l.slug || route.view === "lab-project"} aria-controls="lab-{l.slug}" onclick={() => openLab = openLab === l.slug ? null : l.slug} disabled={route.view === "lab-project"}>
                <span class="v0-title-group"><span class="v0-number">0{i + 1} / 0{labItems.length}</span><span class="v0-project-title">{l.title}</span></span><span class="v0-type">{l.kind}</span>{#if route.view !== "lab-project"}<span class="v0-plus" aria-hidden="true">+</span>{/if}
              </button>
              {#if openLab === l.slug || route.view === "lab-project"}<div id="lab-{l.slug}" transition:slide={{duration:reduceMotion() ? 0 : 650}}><div class="v0-project-body v0-lab-body"><h5>{l.kind}</h5><p>{l.body}</p><p class="v0-meta">{l.status} — Experimental. Features may change; a public app is not available yet.</p><a class="v0-back" href={`#/lab/${l.slug}`}>View project ↗</a></div></div>{/if}
            </article>
          {/each}
        </div>
        {#if route.view === "lab-project"}<a class="v0-back" href="#/lab">← All Lab projects</a>{/if}
      </section>
    {:else if route.view === "about"}
      <section class="v0-work v0-detail">
        <header class="v0-section-heading"><div><span class="v0-eyebrow">{site.name} / {site.base}</span><h2>{site.role}</h2></div></header>
        <div class="v0-about"><p>{site.about.join(' ')}</p><div class="v0-info-grid"><section><h4 class="v0-label red">Focus</h4><h5>{site.focus}</h5></section><div class="v0-divider"></div><section><h4 class="v0-label">Skills</h4>{#each skillGroups as group (group.title)}<p class="v0-meta">{group.title}</p><div class="v0-tags">{#each group.items as tag (tag)}<span>{tag}</span>{/each}</div>{/each}</section></div></div>
      </section>
    {/if}
  </main>
  <footer class="v0-footer"><div class="v0-footer-meta"><div><span>Base</span><p>{site.base}</p></div><div><span>Focus</span><p>{site.role}</p></div></div><div class="v0-footer-links">{#each site.links as link (link.label)}<a href={link.href} target="_blank" rel="noopener">{link.label}</a>{/each}<span>© {site.label}</span></div></footer>
</div>
