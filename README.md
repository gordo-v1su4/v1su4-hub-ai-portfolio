# V1SU4 Hub

Portfolio built with Svelte, Vite, Tailwind CSS, and GSAP.

## Local development

```sh
bun install --frozen-lockfile
bun run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

## Validation

```sh
bun run check
bun run build
```

## Vercel

Import this private GitHub repository into Vercel. The checked-in `vercel.json`
uses Bun to install and build the Vite application and serves `dist`.
Routes use URL hashes, so project and Lab links require no server rewrites.
Project screenshots are stored in `public/images` in this repository.

Keep the repository private. Before publishing a deployment that should also
be private, enable Vercel Deployment Protection for all environments,
including production. Repository privacy alone does not protect a deployed site.
