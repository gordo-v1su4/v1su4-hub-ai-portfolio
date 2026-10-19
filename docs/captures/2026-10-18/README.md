# Portfolio capture corrections — 18 October 2026

All selected images use exactly 16:10 proportions. BeatsMaxxer images are 3840 × 2400; Trailer Feed uses a clean native browser screenshot with its few pixels of browser-edge rounding trimmed to 1904 × 1190. Their visible content fills the complete canvas. No side padding, stretching or letterboxing is added. Versioned filenames avoid stale cached images.

## BeatsMaxxer gallery order

1. **Perform with graphics** — shader test patterns. This is the cover.
2. **Perform with video** — Redline clips in all ten rack slots.
3. **Clip bank detail** — enlarged clip thumbnails and adjacent rack context, with the unused PGM rail collapsed through its normal UI control.
4. **FX rack detail** — Transition, Speedramp and Light Leak controls.
5. **Timing** — recaptured Timesampler workspace with the song-section strip and all source previews ready.
6. **Arrangement** — recaptured full-width timeline, all ten lanes and section boundaries. The Timing editor is collapsed through its normal UI control.
7. **Help** — a focused capture of the real Help dialog at a smaller viewport, so its text fills the frame.

The first, second and fourth images retain native 1920 × 1200 logical captures at 2× density. Timing and Arrangement were recaptured at a wider native 16:10 viewport, 2240 × 1400, to fit their controls directly into the frame. Help and the bank detail use real screenshot regions at matching 16:10 proportions. No app UI was composited or reconstructed.

The previous 3840 × 2800 originals are retained locally in `originals/previous/`. Their padded exports are superseded. `prepare_assets.py` rejects any source that is not already 3840 × 2400. It converts to lossless WebP without changing pixels or adding margins. Every manifest entry must report a 3840 × 2400 content area and zero offsets.

## Trailer Feed

The previous `trailer-feed-selected.png` was 1643 × 1237 and produced side bars inside the standard frame. Its replacement is `trailer-feed-selected-v4.jpg`, a native browser screenshot of the populated homepage, showing Delivery and latest renders. High-density raw captures were rejected after visual inspection found a compositor defect that inserted a black band. The clean native capture returned 1910 × 1194; six pixels at the right and four at the bottom were trimmed to make exact 16:10 without upscaling or stretching.

## Scope

This pass changes portfolio imagery and its order. A deeper Perform guide remains follow-up work. The missing song-section strip in Perform is a separate application issue; these captures do not fabricate that strip. No production media or saved workflows were modified.

`originals/` and `verification/` are ignored local capture evidence.
