<script lang="ts">
  import { projects } from "./data/projects";
  import { router } from "./lib/router.svelte";
  import EditorialPortfolio from "./variations/editorial/EditorialPortfolio.svelte";
  import WowPreview from "./variations/wow/WowPreview.svelte";
  const route = $derived(router.route);
</script>

{#if route.view === "wow" || route.view === "wow-project"}
  <WowPreview slug={route.view === "wow-project" ? (route.slug ?? projects[0].slug) : undefined} />
{:else}
  <EditorialPortfolio {route} />
{/if}
