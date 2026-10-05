<script lang="ts">
  import { site } from "../data/projects";

  let { open, onclose }: { open: boolean; onclose: () => void } = $props();
  let copied = $state(false);

  async function copy() {
    if (!site.email) return;
    try { await navigator.clipboard.writeText(site.email); copied = true; } catch { /* address stays visible to select */ }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 md:items-center" onclick={onclose}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div role="dialog" aria-modal="true" aria-label="Contact" tabindex="-1" onclick={(e) => e.stopPropagation()} class="w-full max-w-[520px] rounded-t-2xl bg-ink p-6 text-accent md:rounded-2xl">
      <div class="mb-5 flex items-center justify-between font-mono text-[13px] font-semibold uppercase">
        <span>Contact</span>
        <button onclick={onclose} aria-label="Close">[×]</button>
      </div>
      {#if site.email}
        <p class="select-all text-center font-mono text-[14px] font-bold">{site.email}</p>
        <button onclick={copy} class="mt-4 w-full bg-accent py-3 font-mono text-[12px] font-bold uppercase tracking-[0.06em] text-ink">{copied ? "Copied" : "Copy email"}</button>
      {:else}
        <p class="text-center font-mono text-[12px] font-medium uppercase opacity-80">Email coming soon. Reach me on LinkedIn for now.</p>
      {/if}
    </div>
  </div>
{/if}
