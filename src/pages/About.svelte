<script lang="ts">
  import { site, skillGroups } from "../data/projects";
  import { COL } from "../lib/router.svelte";
  import { stagger } from "../lib/stagger";

  const rows: [string, string][] = [
    ["Role", site.role],
    ["Focus", site.focus],
    ["Base", site.base],
    ["Studio", site.label],
    ...skillGroups.map((g): [string, string] => [g.title, g.items.join(", ")]),
  ];
</script>

<!-- Centered like the menu's Work list, with the same entrance. -->
<div use:stagger class="{COL} flex min-h-[70svh] flex-col items-center justify-center gap-8 py-10 text-center">
  <p class="font-mono text-[15px] font-bold uppercase tracking-[0.03em]">{site.name} <span>‘{site.role}’</span></p>
  <p class="max-w-[46ch] font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/75">
    I build custom AI production tools around ComfyUI, choosing the right image, video, audio and music models for each project and connecting them in one pipeline. Before AI, I spent 12+ years as an FX artist at ILM, DNEG, Sony Imageworks, MPC and Luma Pictures.
  </p>
  <div class="font-mono text-[11.5px] uppercase leading-[1.7] tracking-[0.01em]">
    <h2 class="mb-2 text-[16px] font-semibold tracking-[0.03em]">Credits</h2>
    {#each rows as [k, v] (k)}
      <p><span class="font-medium text-accent/55">{k}:</span> <span class="font-bold text-accent">{v}</span></p>
    {/each}
  </div>
</div>
