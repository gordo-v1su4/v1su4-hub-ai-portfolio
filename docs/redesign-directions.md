# Redesign directions

Three alternative front ends for the portfolio. Each is a separate route; nothing in the
editorial site or `/glitch` changes. `/redesign` loads all three behind a switcher for comparing.

| Route | Entry | Idea |
| --- | --- | --- |
| `/scope` | `scope.html`, `src/redesign/scope/` | A 2.39:1 screening. Each project is a shot graded live in one shader: depth parallax, slow push-in, anamorphic streaks, 24 fps grain. Shots change on a whip pan. |
| `/sim` | `sim.html`, `src/redesign/sim/` | A live point cloud. Plates are scattered into points and pushed out along a depth map; turbulence carries them between projects and the pointer leaves a wake. |
| `/slit` | `slit.html`, `src/redesign/slit/` | A row of slit-scans. Each project is a smeared slit that opens into the full frame. CSS transforms only, no WebGL. |

Locally: `bun run dev`, then open `/scope.html`, `/sim.html`, `/slit.html` or `/redesign.html`
(the short routes are Vercel rewrites).

## Shared pieces

- `src/redesign/core/data.ts` builds the list from `src/data/projects.ts`, so project copy stays in one place.
- `src/redesign/core/detail.ts` builds the case-study and about content; each direction styles the `d-*` classes.

## Plates

Each project has a cinematic plate, a depth map and a thumbnail in `public/images/redesign/`,
built by `scripts/build-redesign-plates.py`. Change a source or crop there and re-run:

    python3 scripts/build-redesign-plates.py --depth   # needs pillow, torch, transformers

`FOCUS` in `core/data.ts` sets the point each plate stays centred on when it is cropped.
Several plates use the earlier monochrome stills (`cinema.jpg`, `beats.jpg`, `hero-eye.jpg`, …)
as atmosphere; the real screen captures appear in each case study.
