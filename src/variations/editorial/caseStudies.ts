export interface ProcessCard {
  title: string;
  body: string;
  tags?: string[];
  accent?: boolean;
  pending?: boolean;
  /** 1-based phase column; aligns micro-process titles with chevron strip */
  phaseCol?: number;
}
export interface ProcessLane {
  label: string;
  mode?: 'sequence' | 'parallel';
  /** First card defaults to this phase column (1-based); later cards increment in sequence lanes */
  startPhaseCol?: number;
  cards: ProcessCard[];
  note?: string;
}
export interface BuildNode {
  id: string;
  role: string;
  name: string;
  body: string;
  parts: string[];
  accent?: boolean;
  pending?: boolean;
}
export interface CaseStudy {
  intro: string;
  phases: string[];
  lanes: ProcessLane[];
  architecture: {
    kind: 'hub' | 'runtime' | 'pipeline' | 'comparison' | 'studio';
    label: string;
    intro: string;
    nodes: BuildNode[];
    connections: string[];
  };
}

// Source audit: docs/project-case-study-sources.md. These are app-specific
// relationships, not a fixed input/process/output or front/back-end template.
export const caseStudies: Record<string, CaseStudy> = {
  'review-room': {
    intro: 'The central media library: originals, take history, creative metadata, review decisions, and controlled delivery stay connected to the same project and asset.',
    phases: ['Ingest & verify', 'Assets & versions', 'Review & revise', 'Publish selected work'],
    lanes: [
      { label: 'Ingest', cards: [
        { title: 'Choose the destination', body: 'Upload videos, images, contact sheets, or storyboards into a project and real folder. A revision can target an existing asset or its production code.', tags: ['Project → folder → asset', 'Workspace or scoped API'] },
        { title: 'Verify the original', body: 'An upload session authorizes storage, verifies the completed object, then seals the original before finalizing its catalog entry.', tags: ['RustFS original', 'Completion checks'] },
        { title: 'Prepare review media', body: 'Video jobs verify media and generate thumbnails and scrub sprites. Each version has its own processing state; still images follow a lighter path.', tags: ['Trigger.dev', 'FFmpeg', 'Retry failed jobs'] },
      ] },
      { label: 'Take history', cards: [
        { title: 'One asset, multiple versions', body: 'New takes append to a stable asset instead of replacing its identity. Version history remains available, and the current pick can change without losing earlier takes.', tags: ['Asset ID stays fixed', 'Version 1 → 2 → 3'], accent: true },
        { title: 'Metadata belongs to the take', body: 'Each version keeps its model, prompt, source, notes, release details, custom fields, and exact grid/reference-image versions. Dimensions and media keys follow that version too.', tags: ['Per-version metadata', 'Exact image references'] },
      ], note: 'Project and folder organize the work. Asset identifies the shot. Version identifies the take. Choosing a different take does not rename the asset or erase its history.' },
      { label: 'Review loop', mode: 'parallel', cards: [
        { title: 'Watch & inspect', body: 'Select a take, scrub video, inspect stills, and draw annotations over images. Grid, list, and table views share the same library.', tags: ['Playback', 'Drawovers', 'Version selector'] },
        { title: 'Decide & respond', body: 'Timecoded comments, ratings, shortlist, and production status support review. Handle notes in the feedback inbox, then upload the next revision.', tags: ['Feedback → revision ↺', 'Asset-level comments'] },
        { title: 'Invite a reviewer', body: 'Scoped review links control access, expiry, passcodes, and downloads. Creator and reviewer permissions remain separate.', tags: ['Private review', 'Revocable links'] },
      ] },
      { label: 'Delivery', cards: [
        { title: 'Connect a project or folder', body: 'Create or choose a Trailer Feed destination, then select the exact ready versions to send. Uploading alone never publishes anything.', tags: ['Explicit selection', 'Project/folder connection'] },
        { title: 'Deliver a saved batch', body: 'Freeze the chosen metadata and references, reserve destination version numbers, then deliver each selected version with a durable receipt and retry state.', tags: ['Saved consent', 'Per-item status', 'Retry failures'], accent: true },
        { title: 'Keep control after publishing', body: 'Refresh can fill empty destination metadata while preserving destination edits. Unsync revokes access; sending again requires a new explicit selection.', tags: ['Refresh', 'Unsync', 'Sync again'] },
      ], note: 'Review Room remains the source of the original bytes. Trailer Feed presents selected versions through controlled media references; delivery does not relocate the canonical files.' },
      { label: 'Studio bridge', mode: 'parallel', cards: [
        { title: 'Creative Studio Pro', body: 'Scoped automation can manage owned shot folders, add take versions, set the current pick, and read project changes. Studio-controlled folders retain their own ownership rules.', tags: ['Shot/take identity', 'Current pick', 'Change feed'] },
      ] },
    ],
    architecture: {
      kind: 'hub', label: 'Canonical media hub',
      intro: 'The catalog and the files have separate jobs. Review, processing, studio automation, and publishing meet at stable asset/version identities.',
      nodes: [
        { id: 'catalog', role: 'Identity & state · central hub', name: 'Convex catalog', body: 'Owns projects, nested folders, stable assets, version histories, review facets, comments, and delivery records.', parts: ['Project/folder IDs', 'Asset → versions → current pick', 'Metadata revisions', 'Grants & sync outbox'], accent: true },
        { id: 'workspace', role: 'Creator & reviewer interface', name: 'Svelte 5 + SvelteKit', body: 'Library views, take selection, player, still-image annotation, feedback inspector, and private review routes.', parts: ['Grid / list / table', 'Comments & inbox', 'Owner-authorized APIs'] },
        { id: 'storage', role: 'Canonical media bytes', name: 'RustFS', body: 'Stores original media and derived posters/sprites under version-specific object keys. Folder moves do not change blob identity.', parts: ['Originals', 'Posters', 'Scrub sprites', 'Verified uploads'] },
        { id: 'processing', role: 'Background processing', name: 'Trigger.dev + FFmpeg', body: 'Verifies video, probes media, builds derivatives, and commits ready state to the exact version. Failed jobs remain retryable.', parts: ['Verify → derivatives → finalize', 'Version-bound jobs'] },
        { id: 'delivery', role: 'Authorized reads & publishing', name: 'Media delivery + sync workers', body: 'Serves authorized byte ranges and exact-version destination media. Durable batches, receipts, refresh, and removal preserve delivery state.', parts: ['Range playback', 'Version grants', 'Leased retries', 'Trailer Feed connection'] },
        { id: 'automation', role: 'Cross-app production integration', name: 'Scoped automation API', body: 'Creative Studio Pro manages shot folders, uploads takes, changes picks, and reads changes without taking ownership of the canonical storage.', parts: ['Project/folder scope', 'Asset/version references', 'Change cursor'] },
      ],
      connections: ['Workspace ↔ Convex catalog', 'Verified uploads → RustFS', 'Trigger/FFmpeg → derivatives + version readiness', 'Studio automation ↔ asset/take history', 'Selected versions → delivery grants → Trailer Feed'],
    },
  },
  'beatsmaxxer-pro': {
    intro: 'A music-driven editing and performance system. Song analysis, clip decoding, timing, arrangement, and live effects meet at a shared program output.',
    phases: ['Music & media', 'Timing & arrangement', 'Perform', 'Video / Resolve'],
    lanes: [
      { label: 'Source paths', mode: 'parallel', cards: [
        { title: 'Analyze the song', body: 'Hosted Essentia supplies rhythm and structure; Web Audio provides a fallback. Beats, sections, and audio triggers drive editing decisions.', tags: ['Tempo', 'Beats & sections', 'MIDI triggers'] },
        { title: 'Load & prepare clips', body: 'Clip slots own their playback sources. Optional slow-motion preparation creates higher-frame-rate media before timing playback.', tags: ['Clip banks', 'Local decode', 'Optional GPU worker'] },
      ] },
      { label: 'Build the edit', cards: [
        { title: 'Generate a first pass', body: 'Musical triggers choose program cuts using Balanced or Random selection. Density, gaps, and trigger chance control how busy the cut becomes.', tags: ['Beat / audio / MIDI', 'Program cuts'] },
        { title: 'Shape playback time', body: 'Speed ramps, stutters, and Time Sampler change motion independently of the shader look. Resident frames support repeat, reverse, and slice patterns.', tags: ['Ramps', 'Stutters', 'Time Sampler'], accent: true },
        { title: 'Arrange the song', body: 'Edit song sections, assign clip banks, loop passages, and record cuts plus timing settings into a take that can be replayed.', tags: ['Section snapshots', 'Record / replay', 'Arrangement JSON'] },
      ] },
      { label: 'Live output', mode: 'parallel', cards: [
        { title: 'Perform the effects rack', body: 'Live WGSL effects and beat-synced program switching feed the shared WebGPU monitor. The phone shell and Windows app use the same core experience.', tags: ['WebGPU', 'Program monitor', 'Live control'] },
        { title: 'Shape the soundtrack', body: 'Key, pitch, and tempo controls use SoundTouch, while the audio timeline remains the clock for the saved performance.', tags: ['Web Audio', 'SoundTouchJS'] },
      ] },
      { label: 'Two outputs', mode: 'parallel', cards: [
        { title: 'Render a video', body: 'Export the song or a loop using original-resolution sources, chosen output FPS, and processed audio. Incomplete timing preparation blocks export.', tags: ['Song / loop', 'Source-resolution output'], accent: true },
        { title: 'Continue in Resolve', body: 'Export a Timing timeline package with FCPXML, reference video, song audio, a source manifest, and required prepared media.', tags: ['Editable timeline', 'Relink original clips'] },
      ] },
    ],
    architecture: {
      kind: 'runtime', label: 'Synchronized playback runtime', intro: 'Audio time drives the edit; clip decoding, frame selection, and GPU rendering have distinct responsibilities.',
      nodes: [
        { id: 'ui', role: 'Editing & performance', name: 'SvelteKit workspaces', body: 'Rack, Timing, Arrange, clip banks, section editing, and saved take controls.', parts: ['Svelte 5', 'Portable arrangement state'] },
        { id: 'audio', role: 'Clock & musical signals', name: 'Web Audio + Essentia + SoundTouch', body: 'Song playback, rhythm/structure analysis, musical triggers, and independent key/pitch/tempo.', parts: ['Audio timeline', 'Hosted analysis / fallback', 'MIDI input'] },
        { id: 'media', role: 'Decode & frame residency', name: 'PlaybackCoordinator + VideoPool', body: 'Slot-owned video pipelines prepare sources; timing runtimes select the frames needed for the current musical position.', parts: ['HTML video decode', 'GPU frame caches', 'Time Sampler'] },
        { id: 'render', role: 'Program output', name: 'AppLoop → WebGpuEngine', body: 'One animation loop coordinates the program director and renders WGSL modules into the program monitor.', parts: ['WebGPU only', 'Effect module catalog', 'Shared program canvas'], accent: true },
        { id: 'prepare', role: 'Optional media preparation', name: 'GPU interpolation worker', body: 'Queued NVDEC → CUDA RIFE → NVENC processing prepares slow-motion sources and stores verified results in RustFS.', parts: ['Optional hosted worker', 'Prepared clips before playback'] },
        { id: 'output', role: 'Recording & external editing', name: 'Video export + Resolve package', body: 'Combines program frames and processed audio, or writes an editable FCPXML package with a source manifest.', parts: ['Video / loop export', 'FCPXML + media'] },
        { id: 'shell', role: 'Desktop distribution', name: 'Tauri 2 / Rust shell', body: 'Wraps the shared web build with desktop windowing, the analysis proxy, and signed application updates.', parts: ['Windows desktop', 'Shared browser runtime'] },
      ], connections: ['Song → audio clock + rhythm signals', 'Clip pool → timing frame selection → WebGPU program', 'Recorded take → replay → video / Resolve export', 'Optional preparation → verified resident media'],
    },
  },
  'pindeck': {
    intro: 'Images enter through different sources, pass through approval and enrichment, produce metadata and variations, land on curated boards, then become storyboards or pitch decks.',
    phases: ['Collect', 'Approve & enrich', 'Explore lineage', 'Compose'],
    lanes: [
      { label: 'Three inputs', mode: 'parallel', startPhaseCol: 1, cards: [
        { title: 'Discord', body: 'React to a channel image to queue it. Source message context and sref are retained for later search and variations.', tags: ['Bot', 'Source permalink', 'sref'], phaseCol: 1 },
        { title: 'Pinterest', body: 'Extract a pin, board, or profile and send new images to the review queue. Imports remain pending until approved.', tags: ['Extractor / polling', 'Pending queue'], phaseCol: 1 },
        { title: 'Local uploads', body: 'Upload selected files through the same finalization, metadata, and palette pipeline used by imported images.', tags: ['Upload → finalize'], phaseCol: 1 },
      ] },
      { label: 'Enrichment', startPhaseCol: 2, cards: [
        { title: 'Approve & store', body: 'Moderation decides which imported images enter the active library. Durable media and orchestration state are tracked separately.', tags: ['Approve / deny', 'RustFS originals'], phaseCol: 2 },
        { title: 'Analyze the image', body: 'Vision writes cinematic group, genre, shot, style, and tags. Color extraction produces reusable dominant palettes.', tags: ['Vision model', 'Palette analysis'], accent: true, phaseCol: 2 },
      ] },
      { label: 'Creative branches', mode: 'parallel', cards: [
        { title: 'Find a direction', body: 'Search and filter the library by metadata, palette, and sref; use gallery and table views to compare references.', tags: ['Library filters', 'Collections'], phaseCol: 3 },
        { title: 'Generate variations', body: 'Choose a mode and count. Generated children retain parent/root lineage and inherited style-reference context.', tags: ['fal.ai edits', 'Parent → child ↺'], phaseCol: 3 },
      ] },
      { label: 'Compose', mode: 'parallel', startPhaseCol: 4, cards: [
        { title: 'Curate boards', body: 'Save selected images into boards without rebuilding their origins or variation history.', tags: ['Board membership', 'Shared image records'], accent: true, phaseCol: 4 },
        { title: 'Storyboard layouts', body: 'Arrange board images into grid, hero, and strip panels, then save the composition to the project data.', tags: ['Panels', 'Saved layout'], phaseCol: 4 },
        { title: 'Pitch-deck composer', body: 'Build slides from curated strips with typography, palettes, and effects. Deck and slide changes autosave to Convex.', tags: ['Slides', 'Autosave'], phaseCol: 4 },
      ], note: 'Boards are the hub; storyboards and pitch decks branch from the same curated set.' },
    ],
    architecture: { kind: 'pipeline', label: 'Ingest, enrich, compose', intro: 'An ingestion pipeline feeds a shared image catalog. Generation and composition branch from those same records.', nodes: [
      { id: 'sources', role: 'Source connectors', name: 'Discord bot + Pinterest worker', body: 'Always-on Discord ingestion and Pinterest extraction/polling bring external references into approval.', parts: ['Source context', 'Deduplication', 'Pending imports'] },
      { id: 'jobs', role: 'Orchestration', name: 'Trigger.dev', body: 'Coordinates upload finalization, import ingestion, analysis, and variation work.', parts: ['Durable jobs', 'Status & leases'], accent: true },
      { id: 'catalog', role: 'Shared records & access', name: 'Self-hosted Convex', body: 'Keeps image metadata, lineage, user access, boards, storyboard layouts, decks, and preferences.', parts: ['Realtime data', 'Auth', 'Image relationships'], accent: true },
      { id: 'intelligence', role: 'Analysis & generation', name: 'Vision + palette extraction + fal.ai', body: 'Vision enriches metadata; palette analysis supports color search; image editing creates linked variants.', parts: ['OpenRouter-compatible vision', 'Nano Banana Pro edits', 'sref context'] },
      { id: 'storage', role: 'Media', name: 'RustFS + media gateway', body: 'Durable original and generated images stay separate from the database records that describe them.', parts: ['Originals', 'Generated children', 'Media URLs'] },
      { id: 'ui', role: 'Curation & composition', name: 'React + TypeScript', body: 'Gallery/table, metadata drawer, boards, storyboard builder, and autosaving deck composer.', parts: ['Vite', 'Storyboard panels', 'Pitch-deck slides'] },
    ], connections: ['Connectors / upload → moderation → finalization', 'Trigger jobs ↔ catalog + media storage', 'Catalog → variation lineage / boards', 'Boards → storyboards + decks'] },
  },
  'trailer-feed': {
    intro: 'A presentation catalog for finished projects and selected takes. Review Room can supply canonical media; Trailer Feed supplies the browsing, comparison, and presentation context.',
    phases: ['Connect or upload', 'Register takes', 'Present & compare'],
    lanes: [
      { label: 'Source routes', mode: 'parallel', cards: [
        { title: 'Receive Review Room versions', body: 'Connect a destination project and receive the exact selected source asset/version references. Media stays in Review Room.', tags: ['External source identity', 'Controlled resolver'] },
        { title: 'Upload directly', body: 'Create a project and upload finished media into Trailer Feed’s own catalog and storage pipeline.', tags: ['Independent upload path', 'Processing status'] },
      ] },
      { label: 'Catalog', cards: [
        { title: 'Allocate take identities', body: 'Batch reservation assigns destination version numbers before external delivery. Source identity and consent generation distinguish repeat delivery from a new selection.', tags: ['Stable Vn', 'Delivery receipts'] },
        { title: 'Carry creative context', body: 'Show the supplied model, prompt, references, and notes beside each take. Metadata refresh fills empty fields while respecting edits made at the destination.', tags: ['Source metadata snapshot', 'Destination edits'] },
      ] },
      { label: 'Presentation', mode: 'parallel', cards: [
        { title: 'Browse the projects', body: 'Project cards, thumbnails, and playback present completed work as an accessible collection.', tags: ['Project library', 'Finished work'], accent: true },
        { title: 'Compare the takes', body: 'Switch versions and revisit the creative context behind each result, with shot grids and reference imagery where supplied.', tags: ['Take playback', 'Prompt / model detail'] },
      ], note: 'Review Room owns the source asset history and delivery consent. Trailer Feed owns its presentation catalog. It is not the central production review library.' },
    ],
    architecture: { kind: 'pipeline', label: 'Presentation catalog & source adapters', intro: 'External Review Room versions and direct uploads meet in one presentation model without pretending they use the same storage path.', nodes: [
      { id: 'web', role: 'Presentation', name: 'SvelteKit', body: 'Project browser, take comparison, player, thumbnails, and creative-context panels.', parts: ['Project → takes', 'Version detail'] },
      { id: 'api', role: 'Catalog API & jobs', name: 'Python service', body: 'Registers projects and versions, processes direct uploads, and accepts external version deliveries.', parts: ['Upload processing', 'External ingest', 'Metadata refresh'] },
      { id: 'db', role: 'Presentation records', name: 'SQLite', body: 'Stores project documents, take ordering, target version reservations, and external source identities.', parts: ['Reserved Vn', 'Source mappings', 'Delivery state'], accent: true },
      { id: 'external', role: 'Canonical external media', name: 'Review Room references', body: 'Authorized resolver URLs serve selected original/poster versions; revocation and source deletion stay enforceable.', parts: ['No second original upload', 'Version-scoped access'] },
      { id: 'local', role: 'Direct-upload media', name: 'RustFS', body: 'Holds media uploaded directly into Trailer Feed through its separate storage path.', parts: ['Uploaded originals', 'Project thumbnails'] },
    ], connections: ['Review Room → external version adapter → catalog', 'Direct upload → processing → RustFS + catalog', 'SQLite catalog → SvelteKit presentation', 'Source refresh / unsync → selected destination version'] },
  },
  'video-haven': {
    intro: 'A series experience with several ways into the same fictional world: story, working previews, characters, locations, and production artwork.',
    phases: ['Enter the series', 'Explore the world', 'Open the production material'],
    lanes: [
      { label: 'Series entrance', startPhaseCol: 1, cards: [
        { title: 'Meet Blood Rush', body: 'The series presentation establishes the premise and visual direction before opening the collection and world material.', tags: ['Story', 'Creative direction'] },
      ] },
      { label: 'Explore freely', mode: 'parallel', startPhaseCol: 2, cards: [
        { title: 'The DVD collection', body: 'Drag the looping shelf, focus a holographic sleeve, open its case, and watch available working footage. Unreleased cases remain labeled.', tags: ['Shelf → case → disc', 'Working previews'], phaseCol: 2 },
        { title: 'Characters & locations', body: 'Open auditions and reference sheets, then explore the environments and location material that define the series.', tags: ['Audition footage', 'Character sheets', 'World material'], phaseCol: 2 },
        { title: 'Production artwork', body: 'Inspect storyboard sheets and visual-development images in focused lightboxes without leaving the series page.', tags: ['Storyboards', 'Enlarge artwork'], phaseCol: 3 },
      ] },
      { label: 'Presentation engine', mode: 'parallel', startPhaseCol: 3, cards: [
        { title: 'Physical-feeling objects', body: 'Pointer and touch interactions tilt the sleeves; one focused case receives the full foil treatment while visibility controls pause off-screen work.', tags: ['Holographic shader', 'Focus & visibility'], phaseCol: 3 },
        { title: 'Accessible exploration', body: 'Responsive images, reduced-motion behavior, coarse-pointer handling, shared modals, and a common player support different screens and input styles.', tags: ['Responsive assets', 'Reduced motion'], accent: true, phaseCol: 3 },
      ] },
    ],
    architecture: { kind: 'studio', label: 'Content branches + interactive presentation', intro: 'This is a static creative experience, not an upload/versioning backend. Its depth is in content presentation and the rendering/interaction layers.', nodes: [
      { id: 'content', role: 'Series content', name: 'Typed content & artwork data', body: 'Maps titles, supplied sleeve artwork, working footage, characters, locations, and storyboard sheets.', parts: ['Content records', 'Artwork references', 'Media provenance'] },
      { id: 'interface', role: 'Interface & navigation', name: 'React + TypeScript', body: 'Shared player/lightbox contexts connect the collection, character drawers, and artwork modals.', parts: ['React 19', 'Shared modal/player state'] },
      { id: 'render', role: 'Objects & materials', name: 'Three.js + holographic engine', body: 'Renders sleeve materials and disc/case experiences, with texture caching and active-case focus.', parts: ['Foil material', 'Texture cache', 'Visibility-aware updates'], accent: true },
      { id: 'motion', role: 'Motion & input', name: 'GSAP + shelf interaction', body: 'Coordinates reveals, shelf movement, pointer/touch behavior, and reduced-motion alternatives.', parts: ['Looping shelf', 'Spring motion', 'Reduced motion'] },
      { id: 'assets', role: 'Static delivery', name: 'Vite + responsive media', body: 'Builds the site and serves artwork/video assets with responsive image selection.', parts: ['Static build', 'Image derivatives', 'No application backend'] },
    ], connections: ['Series content → collection / characters / artwork', 'Active sleeve → holographic renderer', 'Case selection → shared player', 'Artwork selection → shared lightbox'] },
  },
  'frame-lab': {
    intro: 'One controlled musical workload, several playback strategies, and recorded observations of whether the requested frames arrived on time.',
    phases: ['Prepare workload', 'Compare strategies', 'Observe frames', 'Inspect results'],
    lanes: [
      { label: 'Workload', cards: [
        { title: 'Prepare the media', body: 'Use matched multi-clip fixtures or restore local files by their recorded fingerprints. Choose deck count, resolution, and cache conditions.', tags: ['FFmpeg fixtures', '720p / 1080p', 'Media identity'] },
        { title: 'Schedule musical events', body: 'MIDI stems, onsets, phrase starts, and loudness peaks produce repeatable cuts, seeks, stutters, and speed ramps.', tags: ['Seeded schedule', 'Trigger source', 'Groove'] },
      ] },
      { label: 'Strategy comparison', mode: 'parallel', cards: [
        { title: 'HTML video', body: 'Exercise native element decoding and seeking against the same target schedule.', tags: ['Native pipeline'] },
        { title: 'Mediabunny / WebCodecs', body: 'Compare decoded-frame access and scheduling with the musical workload.', tags: ['Frame-oriented decode'] },
        { title: 'Resident GPU frames', body: 'Preload a texture bank and select frames directly, while recording its readiness and memory cost.', tags: ['GPU bank', 'Cache budget'], accent: true },
        { title: 'libmedia capability probe', body: 'Expose adapter availability separately from scored cut trials. A capability probe is not evidence of completed playback.', tags: ['Unscored probe'] },
      ] },
      { label: 'Evidence', cards: [
        { title: 'Observe actual output', body: 'Record frame/cut timing, missed cuts, unique-frame rate, freezes, preload time, and application cache usage.', tags: ['On-time cuts', 'Cut p95', 'Memory'] },
        { title: 'Compare saved runs', body: 'Keep setup, schema revision, media, and completion/validity visible. Descriptive highlights do not declare a universal engine winner.', tags: ['Results history', 'Setup differences'] },
      ] },
    ],
    architecture: { kind: 'comparison', label: 'Shared harness, interchangeable playback', intro: 'The scheduler and observation model stay common while the decoding/frame-delivery strategy changes.', nodes: [
      { id: 'fixtures', role: 'Offline preparation', name: 'FFmpeg + audio analysis fixtures', body: 'Produces consistent clips, track analysis, and MIDI/stem workloads before a browser trial.', parts: ['Prepared media', 'Musical triggers'] },
      { id: 'schedule', role: 'Deterministic workload', name: 'TypeScript scheduler', body: 'Resolves the expected deck, source time, and trigger sequence for each trial.', parts: ['Cuts / remaps', 'Seed / groove', 'Shared clock'] },
      { id: 'adapters', role: 'Parallel strategies', name: 'Native / WebCodecs / GPU / probe', body: 'Strategy adapters receive the same requests, with readiness and capability kept explicit.', parts: ['HTML video', 'Mediabunny', 'GPU texture bank', 'libmedia gate'], accent: true },
      { id: 'measure', role: 'Observed behavior', name: 'Frame telemetry + result model', body: 'Summarizes complete metrics and marks invalid, incomplete, legacy, preview, and trial records distinctly.', parts: ['Frame observations', 'Cut latency', 'Validity checks'] },
      { id: 'results', role: 'Evidence presentation', name: 'Static benchmark UI', body: 'Displays saved runs and setup differences. The current browser benchmark does not require the historical Zig/Rust experiments.', parts: ['Results / playback lab', 'History & filters', 'No upload server'] },
    ], connections: ['Fixtures → shared schedule', 'Schedule → strategy adapters (alternatives)', 'Observed frames → metrics → saved run comparison'] },
  },
  'creative-studio-pro': {
    intro: 'A spatial production board connects story beats, references, generated takes, the current pick, and saved cuts. Generation and finishing follow explicit creative decisions.',
    phases: ['Develop & import', 'Board & references', 'Generate & choose', 'Cut & finish'],
    lanes: [
      { label: 'Development', mode: 'parallel', cards: [
        { title: 'Build the brief', body: 'Develop the seed, brief, and creative direction through the agent and creative-room workflow.', tags: ['Brief lock', 'Creative voices'] },
        { title: 'Import an episode', body: 'Bring structured series/episode material from Notion and retain scene/shot identity and source relationships.', tags: ['Notion import', 'Scene & shot codes'] },
      ] },
      { label: 'Production board', cards: [
        { title: 'Arrange the beats', body: 'Group story cards on a spatial canvas, connect the story spine, and attach shot references.', tags: ['Svelte Flow', 'Beat groups', 'Reference wiring'] },
        { title: 'Approve, quote, confirm', body: 'Generation follows the stage gates, a live credit quote, and explicit confirmation. Request and result history stay attached to the project.', tags: ['Generation gate', 'Higgsfield'], accent: true },
        { title: 'Review multiple takes', body: 'Keep alternate takes on a beat, reject or restore them, and choose the take that belongs on the story spine.', tags: ['Take history', 'Current pick'] },
      ] },
      { label: 'Finish & retain', mode: 'parallel', cards: [
        { title: 'Build named cuts', body: 'Push selected takes into saved cuts, edit trims and speed ramps, add music/sound plans, and lock picture when ready.', tags: ['Cuts', 'Trim / ramp', 'Picture lock'] },
        { title: 'Keep media connected', body: 'Stored takes can retain Review Room asset/version references. The project ledger records production changes alongside the saved board.', tags: ['Review Room', 'Version references', 'Ledger'] },
      ] },
    ],
    architecture: { kind: 'studio', label: 'Board, commands, adapters', intro: 'The visual board is one view of a versioned production model; external providers and storage are reached through explicit adapters.', nodes: [
      { id: 'canvas', role: 'Visual workspace', name: 'SvelteKit + Svelte Flow', body: 'Spatial beats, group layout, take selection, agent chat, and saved-cut controls.', parts: ['Svelte 5', 'AI SDK', 'Canvas layout'] },
      { id: 'domain', role: 'Production model', name: 'Command gateway + project ledger', body: 'Checks expected project versions and stage rules before applying brief, board, generation, take, or cut changes.', parts: ['Version conflicts', 'Stage gates', 'ProjectStore'], accent: true },
      { id: 'notion', role: 'Story source integration', name: 'Notion episode adapter', body: 'Imports scenes/shots and maintains source links, shot codes, and synchronization context.', parts: ['Episode structure', 'Scene refresh'] },
      { id: 'providers', role: 'Creative & generation services', name: 'Agent bridge + Higgsfield', body: 'Creative-room/model selection and gated image/video requests connect to the production record.', parts: ['Live quote', 'Explicit confirmation', 'Generation receipts'] },
      { id: 'preview', role: 'Media inspection', name: 'WebGPU frame banks', body: 'Supports clip preview and filmstrips when the browser has the required capabilities.', parts: ['Resident frames', 'Capability-aware preview'] },
      { id: 'review', role: 'Canonical take storage', name: 'Review Room adapter', body: 'Maps stored takes back to asset/version identities and keeps the chosen pick connected to production.', parts: ['Shot folders', 'Take versions', 'Current pick'] },
    ], connections: ['Board / agent → command gateway → project store + ledger', 'Notion → scene/shot model', 'Confirmed generation → provider → take', 'Selected takes → spine → saved cuts', 'Stored takes ↔ Review Room versions'] },
  },
  'music-video-agent': {
    intro: 'A song-led production workspace with master/stem intake, measured musical structure, lyric timing, editable story sections, reference approvals, and a separate local generation pilot.',
    phases: ['Song & analysis', 'Story & references', 'Production approval', 'Local generation pilot'],
    lanes: [
      { label: 'Audio intake', mode: 'parallel', cards: [
        { title: 'Choose the master & stems', body: 'Keep the selected master authoritative while aligned stems provide additional analysis context. Uploads and saved project revisions survive reconnection.', tags: ['Master audio', 'Aligned stems', 'Durable uploads'] },
        { title: 'Analyze rhythm & structure', body: 'Essentia measures tempo, beats, energy, and proposed musical sections. Edit names/boundaries and audition the sections against the actual song.', tags: ['Essentia Studio', 'Editable sections'], accent: true },
        { title: 'Recover lyric timing', body: 'Transcription and supplied lyric wording support timed story development. Missing words or uncertain timing stay visible for review.', tags: ['Deepgram', 'Word/phrase timing', 'Review required'] },
      ] },
      { label: 'Creative direction', cards: [
        { title: 'Develop the treatment', body: 'Build a narrative arc and section-by-section actions around the song. Proposed interpretations remain editable creative drafts.', tags: ['Treatment', 'Timed story cards'] },
        { title: 'Prepare continuity references', body: 'Track characters, approved looks, and section assignments. Reference decisions and production revisions form the approval context.', tags: ['Characters & looks', 'Reference approval'] },
        { title: 'Approve the production packet', body: 'The local pilot keeps shot slots, reference decisions, revisions, and input mappings together before generation or team interpretations.', tags: ['Approval fingerprint', 'Shot plan', 'Audit history'] },
      ] },
      { label: 'Local pilot', cards: [
        { title: 'Build character sheets', body: 'Operator tooling submits Qwen Image workflows through the SwarmUI-managed ComfyUI backend to prepare reusable character references.', tags: ['Qwen Image', 'ComfyUI / SwarmUI'] },
        { title: 'Render shot interpretations', body: 'MiniMax H3 reference-to-video uses the prepared sheets. Team-specific outputs and lineage remain separate for review and comparison.', tags: ['H3 Ref2V', 'Per-shot lineage'], accent: true },
        { title: 'Assemble against the beat grid', body: 'Local FFmpeg tooling cuts generated clips to the approved music grid. This pilot path is distinct from a finished in-app generation/export feature.', tags: ['FFmpeg', 'Music-aligned assembly'] },
      ], note: 'The song workspace and local pilot are implemented at different levels. Automatic in-app generation, multi-model review, final export, and an installed desktop release remain integration work; the page does not present them as shipped.' },
      { label: 'Next integrations', mode: 'parallel', cards: [
        { title: 'Automated production review', body: 'The intended reviewer-model comparison and production self-check still need their integration and acceptance gates.', tags: ['In development'], pending: true },
        { title: 'In-app generation & export', body: 'Move the verified local production path into the application with durable worker orchestration and final-output review.', tags: ['In development'], pending: true },
      ] },
    ],
    architecture: { kind: 'runtime', label: 'Song workspace + local production system', intro: 'The Rust coordinator connects the song workspace to durable project state and media. Analysis services inform the story, while the local GPU pilot handles reference preparation, shots, and musical assembly.', nodes: [
      { id: 'web', role: 'Song & story workspace', name: 'Svelte + TypeScript', body: 'Master selection, stems, analysis timeline, editable story sections, references, approvals, and timed audio preview.', parts: ['Song analysis UI', 'Story / references / production'] },
      { id: 'api', role: 'Application coordination', name: 'Rust / Axum API', body: 'Owns project commands, bounded operator sessions, verified upload completion, and analysis/transcription jobs.', parts: ['Typed API contract', 'Revision conflicts', 'Upload sessions'] },
      { id: 'catalog', role: 'Durable project state', name: 'Self-hosted Convex', body: 'Persists project revisions, assets, jobs, approvals, and musical/story data through the coordinator.', parts: ['Projects', 'Jobs', 'Approval state'] },
      { id: 'media', role: 'Originals & analysis payloads', name: 'RustFS', body: 'Stores scoped audio/reference media and large analysis payloads separately from project records.', parts: ['Verified objects', 'Durable media'] },
      { id: 'analysis', role: 'Musical & lyric analysis', name: 'Essentia + Deepgram', body: 'Rhythm/section analysis and transcription feed an editable timeline rather than silently replacing the chosen master or supplied wording.', parts: ['Tempo / beats / energy', 'Sections', 'Lyrics & timing'], accent: true },
      { id: 'generation', role: 'Operator-driven local pilot', name: 'Python → SwarmUI / ComfyUI', body: 'Production packets and per-team runs drive Qwen character sheets and H3 reference-to-video shots on the local GPU.', parts: ['Qwen Image', 'MiniMax H3', 'Lineage & receipts'] },
      { id: 'assembly', role: 'Pilot finishing', name: 'FFmpeg assembly', body: 'Probes clips and assembles a music-aligned pilot from the local generation outputs.', parts: ['Beat-grid cuts', 'Reference soundtrack'] },
      { id: 'workers', role: 'Pending application integration', name: 'Durable production workers & review', body: 'Full in-app generation, reviewer-model comparison, and export remain separate acceptance work.', parts: ['Planned orchestration', 'Generation / review / export'], pending: true },
    ], connections: ['Svelte workspace ↔ Rust coordinator ↔ Convex', 'Verified uploads → RustFS', 'Audio → Essentia / Deepgram → editable story sections', 'Approved local packet → Qwen references → H3 shots → FFmpeg pilot', 'Local pilot → future in-app production integration'] },
  },
};
