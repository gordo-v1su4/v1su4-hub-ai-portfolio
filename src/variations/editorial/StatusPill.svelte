<script lang="ts">
  let { status, statusNote }: { status: string; statusNote?: string } = $props();
</script>

{#if statusNote}
  <span class="status-pill status-pill-stack">
    <span class="status-pill-main">{status}</span>
    <span class="status-pill-note">{statusNote}</span>
  </span>
{:else}
  <span class="status-pill">{status}</span>
{/if}
