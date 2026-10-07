# Editorial design source

The new main design is a Svelte port of the local `v1su4-portfolio-design-brief` reference. Its implementation lives in `src/variations/editorial/` and uses the existing `src/data/projects.ts` as the content source.

The copied reference motion files record the donor's GSAP timings and behavior. The Svelte port retains `power3.out`, the 0.24s outgoing and 0.52s incoming preview transition, 0.42s copy transition with 0.045s stagger, 0.26s elastic tap response, 0.55s entrance with 0.05s stagger, and 0.5s scroll reveals. Reduced motion bypasses movement. Desktop previews change without shifting the project list; mobile links open project pages directly.

Current user adjustments: neutral zinc surfaces with red accents, softer zinc whites, compact 32px action buttons, V1SU4 and Gordo branding, and a mirrored blurred edge fill behind Review Room's desktop preview. A scroll-scrubbed perspective/parallax effect applies to image frames, including the stacked mobile homepage images, and is disabled for reduced motion. Screenshots and public links come from the portfolio repository rather than the donor's sample content.

The previous main design is preserved on `codex/previous-v0-design` at `c6f8090`. Its components remain in `src/variations/v0/`. The donor folder is unchanged.
