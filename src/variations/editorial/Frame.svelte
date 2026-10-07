<script lang="ts">
  import { depth } from './motion';
  let { src, alt, eager = false, natural = false, class: className = '' }:
    {src: string; alt: string; eager?: boolean; natural?: boolean; class?: string} = $props();
  const reviewRoomImage = $derived(src === '/images/review-room-main.webp');
</script>
<figure use:depth class={`relative ring-1 ring-white/10 ${natural ? '' : 'aspect-[16/10] bg-ink-2'} ${className}`}>
  <img {src} {alt} width={reviewRoomImage ? 3840 : undefined} height={reviewRoomImage ? 2664 : undefined} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false"
    class={natural ? 'block h-auto w-full' : 'absolute inset-0 h-full w-full select-none object-contain'} />
  <span aria-hidden="true" class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-accent"></span>
  <span aria-hidden="true" class="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-white/20"></span>
</figure>
