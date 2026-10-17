# Portfolio capture set — 17 October 2026

All 13 selected images are 3840 × 2400 pixels (16:10), captured from the deployed apps at a 1920 × 1200 logical viewport with 2× pixel density. No app UI has been composited or reconstructed. Lossless WebP assets live in public/images/captures/2026-10-17/; local original PNG captures are retained in originals/. See manifest.json for filenames, dimensions and asset paths.

## Review Room

Source: https://review.v1su4.dev/ (release 4ebcb4b).

- Lead: review-room-review — Bloodrush folder, library and approved take in the video viewer.
- Library, list and table — alternative browsing views of the populated Bloodrush folder.
- Drawover — actual image annotation tools, two temporary marks and an unsent feedback draft. All demo marks and text were cleared without saving or submitting feedback.
- Shortlist — existing shortlist preview. No shortlist membership was changed for the capture.
- Playback was verified in the app. The review lead and shortlist capture show the player; a redundant extra playback capture was excluded during selection.
- Publishing — existing connected Bloodrush scope and saved synced deliveries to Trailer Feed; no new publications were created for the capture.
- Media flow and metadata model — completed in-app documentation.

## Trailer Feed

Source: https://www.trailerfeed.video/

- Lead: trailer-feed-main — Delivery take v3, with the requested lowered-sunglasses image and the version controls visible.
- Comparison — Pair mode comparing Delivery v3 and v2.
- Home — populated screening room with Delivery in the hero.
- Prompts — existing Seedance Beat-Sync MV Trio recipe. Missing imported metadata remains a later content task under Linear V1S-158.

## Framing

Portfolio homepage honors each entry's imageFit. App entries using contain render the full screenshot in the 16:10 preview rather than cropping. Their project-page carousel uses the same 16:10 frame on desktop and mobile. Cinematic cover entries retain their existing treatment. New dated filenames avoid stale image caches.

Creative Studio Pro captures and preview videos are deferred. Gods & Gatekeepers UI work is in a separate chat; CG/3D and god imagery remain deferred. Video Haven is next after this capture pass.

Validation: portfolio Svelte check passed with zero errors/warnings; production build passed. All 13 exported images were checked as 3840 × 2400. Browser checks covered Review Room slide navigation including diagram slides, all four Trailer Feed slides, desktop preview object-fit, and the mobile 16:10 frame without horizontal overflow.
