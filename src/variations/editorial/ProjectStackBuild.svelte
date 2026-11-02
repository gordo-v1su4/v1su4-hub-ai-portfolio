<script lang="ts">
  import IsometricStack from './IsometricStack.svelte';
</script>

<IsometricStack
  stackId="pss-stack"
  title="The studio workflow as a connected stack"
  description="The Next.js interface submits work to Trigger.dev, which orchestrates specialist services including Essentia for audio analysis, AI for generation, and FFmpeg for rendering. RustFS provides shared media storage."
  caption="Essentia analyzes the audio. Trigger.dev coordinates when that work runs."
  layers={[
    { role: 'SHARED STORAGE', name: 'RustFS', detail: 'Media · analysis · exports' },
    { role: 'ANALYZE / GENERATE / RENDER', name: 'Specialist services', detail: 'Essentia audio · AI generation · FFmpeg' },
    { role: 'ORCHESTRATION', name: 'Trigger.dev', detail: 'Coordinates jobs · retries · status', accent: true },
    { role: 'INTERFACE', name: 'Next.js studio', detail: 'Upload · plan · review' },
  ]}
/>
