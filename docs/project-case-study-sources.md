# Project case-study source audit

Checked against local application source on 2026-10-26. This is an implementation/content audit, not production deployment acceptance. No application repositories were changed.

The portfolio shares typography and grayscale materials with Project Stack Structure. Its application pages use distinct process graphs and architecture detail; they do not infer a fixed three-layer stack from a list of tools.

## Review Room

Repository: `../review-room-svelte`.

- `docs/media-flow-overview.md`: original bytes in RustFS, catalog in Convex; upload, video derivatives, asset/take identity, asset-level comments, explicit selected-version publishing, Creative Studio Pro API integration.
- `convex/lib/personalCommands.ts`: upload by asset/code, new version allocation, current-pick behavior, finalization and processing jobs.
- `convex/lib/seriesAssets.ts`: current version mirrors its own playback dimensions/keys; change feed includes asset/version changes.
- `convex/lib/versionMetadata.ts`: per-version creative metadata, optimistic revision check, same-project exact image-version references.
- `convex/personal.ts`: review links, approve/review facets, comments, publication replacement/revocation, showcases.
- `src/routes/api/owner-sync/+server.ts`, `convex/destinationDelivery.ts`, `docs/api/destination-sync.md`: project/folder destination connections; explicit exact-version batch consent; version reservation, durable per-item delivery/retry, refresh, unsync, source deletion, sync again.
- `src/lib/server/media-delivery.ts`: authorized version media and ranged delivery.

Important: the Trailer Feed integration is now implemented in local source. Older notes calling it a proposed integration are stale. Upload does not automatically publish, delivery does not move canonical originals, and comments currently belong to assets rather than exact versions.

## Beatsmaxxer Pro

Repository: `../beatsmaxxer-pro`.

- `README.md`: song analysis, first-pass cuts, Timing/Arrange/Perform, slot-owned video pipelines, WebGPU runtime, SoundTouch, optional GPU interpolation, video and Resolve exports, Tauri shell.
- `svelte/src/lib/audio/AudioEngine.ts:loadAudioFile`: hosted Essentia path and realtime fallback.
- `svelte/src/lib/export/arrangementExport.ts:startArrangementExport`: preparation gates, song/loop capture, program frames and audio.
- `svelte/src/lib/modules/palette.ts`: transition accent is `#4ade80`.

## Pindeck

Repository: `../pindeck`.

- `README.md`: Discord/Pinterest/local inputs, approval, analysis and palettes, sref, variation lineage, boards, storyboard layouts, autosaving pitch decks, self-hosted orchestration/storage.
- `convex/images/shared.ts:resolveLineageRoot`, `convex/lib/variationPrompts.ts:buildVariationPromptPlan`: parent/root lineage and style-reference context.
- `convex/triggerDispatch.ts`, `convex/decks.ts`: jobs and deck persistence.

## Trailer Feed

Repository: `../trailer-feed`.

- `backend/app.py`: `connect_review_project`, `reserve_external_batch`, `register_external_version`, `refresh_review_metadata`, external removal/reactivation, separate direct upload pipeline.
- `src/lib/ui/studio.svelte.ts:buildProject`: target version numbering, take order, creative context and project thumbnails.
- `src/lib/data/version-context.ts`: prompt display with source context.

Review Room owns canonical external media and delivery consent. Trailer Feed owns its presentation catalog and direct-upload media path. Do not describe Trailer Feed as the production storage/review authority.

## Video Haven

Repository: `../video-haven`.

- `src/components/Collection.tsx`, `ShelfDvdCase.tsx`: looping shelf, active foil focus, case selection, working previews.
- `CharacterSheetDrawer.tsx`, `StoryboardPanel.tsx`: reference/artwork enlargement.
- `src/holo/engine.ts`, texture cache; player/artwork contexts; reduced-motion and coarse-pointer hooks.
- `README.md`: typed content/artwork, static asset delivery; unreleased episodes and working media remain labeled.

## Frame Lab

Repository: `../frame-lab`.

- `README.md`: shared musical workload, native / Mediabunny-WebCodecs / resident-GPU strategies, separate libmedia probe, media fingerprints, controlled interpretation limits.
- `web/src/benchmark/schedule.ts`, `results-model.ts`: scheduling, complete-metric summaries, validity and setup differences.

Historical Zig/Rust experiments are not the current browser benchmark runtime. A capability probe is not a scored engine result; no universal engine winner is claimed.

## Creative Studio Pro

Repository: `../creative-studio-pro`.

- `README.md`: spatial beats/takes/cuts, Notion import, gated Higgsfield generation, WebGPU preview.
- `src/lib/application/gateway.ts`: brief/model gates, episode import, shot references/codes, production commands, Review Room take references, named-cut edits/music/sound plans.
- `src/lib/adapters/project-store.ts`: versioned project persistence.

## Music Video Agent

Repository: `../music-video-vending-machine` (same workspace shown in the portfolio screenshot).

- `README.md`, `docs/build-status.md`, `docs/PROGRESS.md`: Rust/Axum coordinator, Convex/RustFS, master/stems, Essentia, Deepgram, editable timed story sections, local generation pilot versus pending in-app integrations.
- `scripts/mvvm_gen/production.py`: approved production packets, reference decisions, revisions, team interpretations and lineage.
- `scripts/mvvm_gen`: Qwen sheets, SwarmUI/ComfyUI H3 shots, FFmpeg music-grid assembly in the operator pilot.
- `apps/web/src/lib/SongAnalysis.svelte`, `apps/web/src/app.css`: timeline violet `#a78bfa`.

Do not claim automatic in-app generation, multi-model review, final export or an installed desktop release is complete. The local pilot is separate from those application acceptance gates.

## Diagram design

The installed diagram-design skill's flowchart/architecture, orthogonal connector, accessible SVG and complexity-budget guidance informed this pass. User-specified portfolio tokens override the skill's default skin and type ramp. `scripts/build-project-diagrams.ts` creates self-contained HTML sources; the portfolio embeds their trusted inline SVG. The source HTML is checked with the skill's `self_check.py`.
