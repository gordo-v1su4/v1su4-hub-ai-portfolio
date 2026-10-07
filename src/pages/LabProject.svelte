<script lang="ts">
  import { labItems } from "../data/projects";
  import CreditLines from "../lib/CreditLines.svelte";
  import { COL } from "../lib/router.svelte";

  let { slug }: { slug: string } = $props();
  const project = $derived(labItems.find((item) => item.slug === slug));
  const next = $derived(project ? labItems[(labItems.indexOf(project) + 1) % labItems.length] : undefined);
</script>

{#if project}
  <article class="mx-auto min-h-[70svh] w-full max-w-[640px] px-4 py-12">
    <p class="font-mono text-[11px] uppercase tracking-[0.06em] text-accent/60">Lab · {project.status}</p>
    <h1 class="mt-6 font-mono text-[22px] font-bold uppercase tracking-[0.03em]">{project.title}</h1>
    <p class="mt-2 font-mono text-[13px] uppercase text-accent/70">{project.kind}</p>
    <p class="mt-10 font-mono text-[14px] font-medium uppercase leading-[1.65]">{project.body}</p>

    <aside aria-label="Project status" class="mt-10 border-y border-accent/20 py-5">
      <h2 class="font-mono text-[13px] font-semibold uppercase">In progress · Experimental</h2>
      <p class="mt-2 font-mono text-[12px] uppercase leading-[1.6] text-accent/70">This project is still being developed. Features and workflows may change; a public app is not available yet.</p>
    </aside>

    <h2 class="mt-10 font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">Credits</h2>
    <div class="mt-3">
      <CreditLines rows={[["Role", "Design / Development"], ["Status", project.status], ["Category", "Lab"]]} />
    </div>
    <a href="#/lab" class="mt-10 inline-block font-mono text-[12px] font-semibold uppercase hover:opacity-70">[All Lab projects ↗]</a>
  </article>
  {#if next}
    <div class="{COL} mt-12 border-t border-accent/20 py-8">
      <a href="#/lab/{next.slug}" class="block font-mono text-[14px] font-semibold uppercase hover:opacity-70">
        <span class="block text-[11px] font-medium text-accent/60">Next Lab project</span>
        <span class="mt-2 block">{next.title} ↗</span>
      </a>
    </div>
  {/if}
{:else}
  <div class="{COL} py-20">
    <h1 class="font-mono text-[20px] font-bold uppercase">Lab project not found</h1>
    <a href="#/lab" class="mt-6 inline-block font-mono text-[12px] uppercase">[All Lab projects ↗]</a>
  </div>
{/if}
