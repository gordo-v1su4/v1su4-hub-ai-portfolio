<script lang="ts">
  import { projects } from "./data/projects";
  import Contact from "./lib/Contact.svelte";
  import Header from "./lib/Header.svelte";
  import Menu from "./lib/Menu.svelte";
  import { router } from "./lib/router.svelte";
  import About from "./pages/About.svelte";
  import Home from "./pages/Home.svelte";
  import Lab from "./pages/Lab.svelte";
  import LabProject from "./pages/LabProject.svelte";
  import Project from "./pages/Project.svelte";
  import WowPreview from "./variations/wow/WowPreview.svelte";

  let menu = $state(false);
  let contact = $state(false);
  const route = $derived(router.route);
  const key = $derived(route.view + (route.slug ?? ""));
</script>

<div class="min-h-svh bg-ink text-accent">
  {#if route.view === "wow" || route.view === "wow-project"}
    <WowPreview slug={route.view === "wow-project" ? (route.slug ?? projects[0].slug) : undefined} />
  {:else}
  <Header onmenu={() => (menu = true)} showBack={route.view !== "home"} />
  {#key key}
    <main class={route.view === "project" ? "" : "pt-[68px]"}>
      {#if route.view === "home"}<Home />
      {:else if route.view === "lab"}<Lab />
      {:else if route.view === "lab-project"}<LabProject slug={route.slug ?? ""} />
      {:else if route.view === "about"}<About />
      {:else}<Project slug={route.slug ?? projects[0].slug} />{/if}
    </main>
  {/key}
  <div class="h-16" aria-hidden="true"></div>
  <Menu open={menu} onclose={() => (menu = false)} oncontact={() => (contact = true)} />
  <Contact open={contact} onclose={() => (contact = false)} />
  {/if}
</div>
