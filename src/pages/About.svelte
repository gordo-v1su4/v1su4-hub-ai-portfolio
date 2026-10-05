<script lang="ts">
  import { site, skillGroups } from "../data/projects";
  import Caption from "../lib/Caption.svelte";
  import CreditLines from "../lib/CreditLines.svelte";
  import { COL } from "../lib/router.svelte";

  const rows: [string, string][] = [
    ["Role", site.role],
    ["Focus", site.focus],
    ["Base", site.base],
    ["Studio", site.label],
    ...skillGroups.map((g): [string, string] => [g.title, g.items.join(", ")]),
  ];
</script>

<div class="{COL} pt-2">
  <Caption name={site.name} sub={site.role} align="left" size="lg" />
  <p class="mt-6 font-mono text-[11.5px] font-medium uppercase leading-[1.55] text-accent/75">
    I build custom AI production tools around ComfyUI, choosing the right image, video, audio and music models for each project and connecting them in one pipeline. Before AI, I spent 12+ years as an FX artist at ILM, DNEG, Sony Imageworks, MPC and Luma Pictures.
  </p>
  <h2 class="mt-10 font-mono text-[16px] font-semibold uppercase tracking-[0.03em]">Credits</h2>
  <div class="mt-3"><CreditLines {rows} /></div>
</div>
