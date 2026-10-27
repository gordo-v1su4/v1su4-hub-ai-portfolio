// Hand-placed diagram geometry; arrows are routed through explicit open gutters.
// Tuple: identity, title, two-line summary, x, y, optional kind.
export type DiagramNode = [string, string, string, number, number, ('store' | 'optional')?];
export interface DiagramDefinition { title: string; description: string; height: number; nodes: DiagramNode[]; paths: string[]; focal: string[]; }
export const workflowDiagrams: Record<string, DiagramDefinition> = {
  'beatsmaxxer-pro': {
    title: 'Beatsmaxxer: music, timing, performance and export', description: 'Song analysis and prepared clips feed timing and arrangement; the program performance can become a video or an editable Resolve timeline.', height: 456, focal: ['timing','perform'],
    nodes: [
      ['song','Song + MIDI','Audio clock / musical triggers',24,24], ['analysis','Rhythm & structure','Essentia / Web Audio fallback',304,24], ['timing','Timing & first-pass cuts','Ramps / stutters / sampler',584,24], ['perform','Live performance','WGSL effects + program output',864,24],
      ['clips','Clip banks','Source files / slot-owned decode',24,184], ['prepare','Prepare & cache','Optional interpolation / frames',304,184], ['arrange','Arrangement take','Sections / record / replay',584,184], ['video','Video export','Program frames + processed audio',864,184], ['resolve','Resolve timeline','FCPXML / sources / audio',864,344],
    ], paths: ['M232 72H304','M512 72H584','M792 72H864','M232 232H304','M512 216H540Q548 216 548 208V152Q548 144 556 144H612Q620 144 620 136V120','M512 248H584','M688 120V184','M968 120V184','M792 232H864','M720 280V384Q720 392 728 392H864'],
  },
  'review-room': {
    title: 'Review Room: one media library, review and delivery', description: 'Verified uploads create versioned assets with metadata; processing and review branch from that history and selected versions can be published.', height: 456, focal: ['versions','delivery'],
    nodes: [
      ['upload','Upload / API intake','Project / folder / asset code',24,24], ['verify','Verify & seal','Original media in RustFS',304,24], ['versions','Asset + take history','Stable asset / version / pick',584,24,'store'], ['metadata','Version metadata','Prompt / model / exact references',864,24],
      ['process','Video processing','FFmpeg thumbnails / scrub sprites',304,184], ['review','Review & revise','Player / notes / drawovers',584,184], ['delivery','Selected-version delivery','Batch / grants / retries',864,184],
      ['studio','Creative Studio Pro','Shot folders / takes / current pick',304,344], ['target','Trailer Feed','Present selected versions',864,344],
    ], paths: ['M232 72H304','M512 72H584','M792 72H864','M408 120V184','M512 232H584','M688 120V184','M968 120V184','M792 232H864','M408 344V320Q408 312 416 312H640Q648 312 648 304V280','M968 280V344'],
  },
  'pindeck': {
    title: 'Pindeck: source collection to creative composition', description: 'Discord, Pinterest and local uploads converge on moderation and enrichment, then branch to variations, boards, storyboards and decks.', height: 456, focal: ['analyze','boards'],
    nodes: [
      ['discord','Discord bot','Images / message context / sref',24,24], ['pinterest','Pinterest worker','Pins / boards / pending imports',24,184], ['upload','Local upload','Files / verified finalization',24,344],
      ['approve','Approve & finalize','Moderation / durable media',304,184], ['analyze','Metadata & palette','Vision tags / dominant colors',584,184],
      ['vary','Generate variations','fal.ai edits / parent-child lineage',584,24], ['boards','Curate boards','Shared images / saved selections',864,184], ['storyboard','Storyboards','Grid / hero / strip panels',864,24], ['decks','Pitch decks','Slides / typography / autosave',864,344],
    ], paths: ['M232 72H256Q264 72 264 80V200Q264 208 272 208H304','M232 232H304','M232 392H280Q288 392 288 384V264Q288 256 296 256H304','M512 232H584','M688 184V120','M792 232H864','M968 184V120','M968 280V344','M792 72H808Q816 72 816 80V200Q816 208 824 208H864'],
  },
  'trailer-feed': {
    title: 'Trailer Feed: source routes and presentation', description: 'Selected Review Room versions and direct uploads retain separate media paths while feeding a shared presentation catalog.', height: 376, focal: ['catalog'],
    nodes: [
      ['review','Review Room selection','Canonical external asset/version',24,24], ['upload','Direct upload','Trailer Feed media processing',24,216], ['reserve','Reserve & register','Destination Vn / source identity',304,24], ['storage','Direct-upload storage','Own RustFS originals',304,216,'store'],
      ['catalog','Presentation catalog','Projects / takes / source metadata',584,120,'store'], ['browse','Browse & watch','Project thumbnails / playback',864,24], ['compare','Compare takes','Prompts / models / references',864,216],
    ], paths: ['M232 72H304','M232 264H304','M512 72H540Q548 72 548 80V144Q548 152 556 152H584','M512 264H556Q564 264 564 256V192Q564 184 572 184H584','M792 152H816Q824 152 824 144V80Q824 72 832 72H864','M792 184H840Q848 184 848 192V256Q848 264 856 264H864'],
  },
  'video-haven': {
    title: 'Video Haven: branches into a fictional world', description: 'The series entrance branches into the DVD collection, character and location material, and production artwork.', height: 456, focal: ['collection'],
    nodes: [
      ['series','Enter the series','Premise / tone / visual direction',24,184], ['collection','DVD collection','Looping shelf / sleeve / case',304,24], ['world','Characters & locations','Auditions / sheets / environments',304,184], ['art','Production artwork','Storyboards / look development',304,344],
      ['holo','Holographic objects','Three.js / focus / texture cache',584,24], ['player','Shared video player','Working previews / auditions',864,104], ['lightbox','Artwork lightbox','Reference sheets / enlargement',864,296],
    ], paths: ['M232 208H252Q260 208 260 200V80Q260 72 268 72H304','M232 232H304','M232 256H276Q284 256 284 264V384Q284 392 292 392H304','M512 72H584','M792 72H824Q832 72 832 80V144Q832 152 840 152H864','M512 216H808Q816 216 816 208V184Q816 176 824 176H864','M512 248H536Q544 248 544 256V336Q544 344 552 344H864','M512 392H808Q816 392 816 384V376Q816 368 824 368H864'],
  },
  'frame-lab': {
    title: 'Frame Lab: one workload, alternative strategies', description: 'A shared musical schedule drives alternate playback strategies and records observations for comparison rather than a universal ranking.', height: 456, focal: ['observe'],
    nodes: [
      ['fixtures','Prepared media','Matched clips / stems / fingerprints',24,104], ['schedule','Musical schedule','Cuts / seeks / ramps / groove',304,104],
      ['native','HTML video','Native decoding and seeking',584,24], ['codec','Mediabunny / WebCodecs','Decoded-frame scheduling',584,184], ['gpu','Resident GPU bank','Texture residency / memory budget',584,344],
      ['observe','Observe actual frames','On-time cuts / p95 / misses',864,184], ['results','Saved-run comparison','Setup / validity / history',864,344],
    ], paths: ['M232 152H304','M512 128H536Q544 128 544 120V80Q544 72 552 72H584','M512 152H552Q560 152 560 160V224Q560 232 568 232H584','M512 176H520Q528 176 528 184V384Q528 392 536 392H584','M792 72H808Q816 72 816 80V200Q816 208 824 208H864','M792 232H864','M792 392H840Q848 392 848 384V264Q848 256 856 256H864','M968 280V344'],
  },
  'creative-studio-pro': {
    title: 'Creative Studio Pro: story board, takes and cuts', description: 'Brief and episode sources feed a board; explicitly confirmed generation produces takes that can be selected into saved cuts and stored in Review Room.', height: 456, focal: ['gate','takes'],
    nodes: [
      ['brief','Creative brief','Seed / direction / creative voices',24,24], ['notion','Notion episode import','Scene / shot identity / references',24,184], ['board','Production board','Beats / groups / story spine',304,104], ['gate','Approve / quote / confirm','Generation gate / live cost',584,104],
      ['takes','Generated takes','Higgsfield / compare / reject / pick',864,104], ['cut','Named cuts','Trims / ramps / picture lock',864,344], ['review','Review Room storage','Asset/version references / pick',584,344],
    ], paths: ['M232 72H256Q264 72 264 80V128Q264 136 272 136H304','M232 232H280Q288 232 288 224V176Q288 168 296 168H304','M512 152H584','M792 152H864','M968 200V344','M936 200V256Q936 264 928 264H696Q688 264 688 272V344'],
  },
  'music-video-agent': {
    title: 'Music Video Agent: song workspace and local pilot', description: 'Audio analysis and lyric timing inform editable story sections, approved references and a local Qwen/H3/FFmpeg production pilot.', height: 488, focal: ['story','render'],
    nodes: [
      ['audio','Master & aligned stems','Verified upload / song identity',24,184], ['analysis','Musical structure','Essentia beats / energy / sections',304,24], ['lyrics','Lyric timing','Deepgram / supplied wording',304,344], ['story','Treatment & timed sections','Editable arc / actions / audition',584,184],
      ['approve','References & approval','Characters / looks / production packet',864,184], ['sheets','Qwen character sheets','Operator-driven local pilot',864,344], ['render','H3 shot interpretations','Reference-to-video / team lineage',584,344], ['assemble','Music-aligned pilot','FFmpeg / beat-grid assembly',24,344],
    ], paths: ['M232 208H256Q264 208 264 200V80Q264 72 272 72H304','M232 256H280Q288 256 288 264V384Q288 392 296 392H304','M512 72H536Q544 72 544 80V208Q544 216 552 216H584','M512 392H552Q560 392 560 384V256Q560 248 568 248H584','M792 232H864','M968 280V344','M864 392H792','M584 392H576Q568 392 568 400V456Q568 464 560 464H248Q240 464 240 456V400Q240 392 232 392'],
  },
};
