# BeatsMaxxer portfolio capture set — 18 October 2026

Seven real application screens use the same 16:10 contained gallery as Review Room. Every exported asset is 3840 × 2400, in lossless WebP, with a dated filename to avoid stale caches. The cover also supplies the portfolio index preview.

## Gallery order

1. **Perform with video** — the complete public Redline Perform demo, ten populated rack slots and the program output, paused after playback for a clear Transition frame. This is the cover.
2. **Perform with graphics** — a clean workspace with the app's animated test patterns, before loading any videos.
3. **Clip bank detail** — the populated Clips browser, reusable Verse / Chorus banks, source thumbnails and neighboring rack context; a 1280 × 800 viewport region at 1.5× detail scale.
4. **FX rack detail** — Transition, Speedramp and Light Leak previews, shape controls, presets and mixes; a 960 × 600 viewport region at 2× detail scale.
5. **Timing** — the supplied complete Timing workspace and Timesampler editor.
6. **Arrangement** — the supplied song arrangement, source lanes and export controls.
7. **Help** — the supplied in-app guide. This represents the current documentation; a deeper Perform guide remains follow-up work.

## Sources and sizing

The first four were captured from https://www.beatsmaxxing.com/ at a 1920 × 1200 logical viewport and 2× pixel density. Detail views are intentional browser screenshot regions, rather than invented or rearranged UI. The app's screen treatment and colors are preserved.

The other three are the prepared PNGs from `beatsmaxxer-pro/svelte/.artifacts/portfolio-2026-10-18/`. Their 3840 × 2800 originals are retained locally. To keep their complete controls visible, they are proportionally fitted to the 3840 × 2400 canvas, with matching dark side margins. They are not stretched or cropped. The manifest records the exact content size and offsets, so this small scale difference is explicit.

`originals/` and `verification/` are local and ignored. Run `prepare_assets.py` with Pillow to regenerate the selected exports and manifest from the originals. No media is uploaded or re-published inside BeatsMaxxer, and no production workflow is saved or altered for these screenshots.

## Verification

Svelte check: zero errors and warnings. Production build passed. The existing project gallery also passed the Svelte autofixer without issues or suggestions. All seven browser-loaded images report 3840 × 2400, `object-fit: contain`, and a 1.6 frame ratio. Navigation stops at the last slide. At a 393px mobile viewport the frame stays 16:10 and there is no horizontal page overflow.
