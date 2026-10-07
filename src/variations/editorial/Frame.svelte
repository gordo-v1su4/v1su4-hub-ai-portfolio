<script lang="ts">
  let { src, alt, eager = false, natural = false, cropSides = 0, monochrome = false, class: className = '' }:
    {src: string; alt: string; eager?: boolean; natural?: boolean; cropSides?: number; monochrome?: boolean; class?: string} = $props();
  const reviewRoomImage = $derived(src === '/images/review-room-main.webp');
</script>
<figure class={`relative ring-1 ring-white/10 ${natural ? '' : 'aspect-[16/10] bg-ink-2'} ${className}`}>
  <div class={natural ? 'overflow-hidden' : 'contents'}>
  <img {src} {alt} width={reviewRoomImage ? 3840 : undefined} height={reviewRoomImage ? 2664 : undefined} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false"
    style:width={natural && cropSides ? `${100 / (1 - 2 * cropSides)}%` : undefined}
    style:max-width={natural && cropSides ? 'none' : undefined}
    style:margin-left={natural && cropSides ? `${-100 * cropSides / (1 - 2 * cropSides)}%` : undefined}
    style:filter={monochrome ? 'grayscale(1)' : undefined}
    class={natural ? 'block h-auto w-full' : 'absolute inset-0 h-full w-full select-none object-contain'} />
  </div>
  <span aria-hidden="true" class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-accent"></span>
  <span aria-hidden="true" class="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-white/20"></span>
</figure>
