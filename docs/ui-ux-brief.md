# V1SU4 Portfolio UI and UX Brief

**For:** Senior developer · **Scope:** One-page PRD and alternative design direction

Build a distinctive, easy-to-browse portfolio for Gordo’s creative production and software tools. Visitors should quickly understand each project, see real work, and reach the public application. Preserve the existing content and identity while simplifying navigation and project discovery.

## Audience and outcome

Studio collaborators, prospective clients, and technical peers exploring the work on desktop or phone. The main journey is **discover a project → understand its purpose → view its case study or open the application**. Secondary journeys are exploring experiments, learning about Gordo, and following professional/contact links.

## Basic requirements

- **Portfolio:** Review Room, Pindeck, Beatsmaxxer Pro, Frame Lab, Trailer Feed, Project Stack Structure, and V1SU4 Format.
- **Lab:** Creative Studio Pro and Music Video Agent. Give experiments real detail pages with clear development status.
- **Project detail:** Title, category, short description, imagery, role, workflow, status/year, and stack. Prioritize purpose and visuals; keep technical details secondary.
- **Actions:** “View Project” opens the internal case study; “Open App” opens the actual public domain. Projects without an app still have an internal page and an honest status. Avoid dead or placeholder links.
- **Media:** Store screenshots in this repository, preserve their proportions, and avoid cropped interfaces or gray letterboxing. Keep existing URLs usable.
- **Design and motion:** Must have a very contemporary, modern UI look and feel, with intentional typography, confident spacing, and polished interactions. GSAP animations are required for coordinated entrances, project preview transitions, and interaction feedback. Motion must feel fluid on desktop and mobile, preserve reading and scroll position, and respect reduced-motion preferences.
- **Mobile performance:** Must feel very snappy: immediate tap feedback, fast navigation, and smooth scrolling. Keep transitions short and interruptible; never make visitors wait for an animation to finish. Optimize images, load secondary media on demand, and avoid heavy effects. Verify responsiveness on a real phone with a typical mobile connection.
- **Dark palette:** Use zinc or neutral grays for backgrounds, surfaces, borders, and muted text. No slate, blue tones, or blue-tinted gradients or glass. Retain restrained red accents and clear text contrast.

## Current layout

Full-screen introduction → large expandable project rows → project details → background/skills → footer. Navigation includes Portfolio, Lab, and Archives. Expanded project information uses two columns on desktop and stacks on mobile. The large titles are the strongest visual feature; opening and closing long rows can make browsing feel unstable.

## Proposed creative and UX alternative

Use an **editorial project index with a selected project preview**. On desktop, keep a compact, readable title list beside one preview showing the selected project’s image, description, status, and actions. Selection replaces the preview without changing the height of the title list. Long case studies open on their own pages.

On mobile, use a single-column index with a short summary or thumbnail per project. Tap through to the detail page instead of expanding a long accordion. Back navigation restores the visitor’s position. Use the same structure for Lab, distinguished by its experimental status.

Retain a zinc or neutral dark textured backdrop, restrained red accents, oversized condensed titles, and lightly frosted neutral navigation. Remove blue tones from the backdrop and effects. Keep Bebas Neue titles and Space Mono menu lettering; use Archivo Narrow for detail headings and Geist Mono for descriptions/labels. Use GSAP motion to reinforce hierarchy and selection without delaying navigation. **No red foil or shimmering title effect.**

## Acceptance and handoff

Verify comfortable reading and tapping on phones, keyboard operation, visible focus, reduced-motion support, working links, complete images, and stable selection/back navigation. Visitors must understand a project and find its main action without reading the stack.

Provide one desktop and one mobile wireframe plus a clickable browsing prototype before implementation. Explore a more creative composition if it improves clarity, while preserving the content, typography hierarchy, public links, and project routes. Keep the existing Svelte/Vite and Vercel setup; this scope covers the portfolio experience.
