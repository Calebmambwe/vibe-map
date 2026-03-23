# CLAUDE.md

## Project
VibeMap — Real-time interactive 3D globe where visitors drop their mood as glowing pulses.

- Stack: Next.js 16 + TypeScript + Tailwind CSS v4 + Framer Motion + react-globe.gl
- Styling: Tailwind CSS utility classes only. Dark theme by default.

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Typecheck: `pnpm exec tsc --noEmit`

## Architecture
- `src/app/` — Next.js App Router pages and API routes
- `src/app/api/vibe/` — Vibe CRUD API (GET all vibes, POST new vibe)
- `src/app/api/og/` — Dynamic OG image generation (Edge runtime)
- `src/components/globe/` — 3D globe (VibeGlobe, GlobeLoader)
- `src/components/mood/` — Mood selector UI
- `src/components/stats/` — Vibe statistics panel
- `src/components/shared/` — ShareCard, VibeDropButton
- `src/lib/` — Utilities (env, animations, vibe-store)
- `src/hooks/` — Custom hooks (useVibes, useGeolocation)
- `src/types/` — TypeScript types (vibe.ts with Mood/Vibe/VibeStats)

## Conventions
- react-globe.gl must be loaded with `dynamic(() => import(...), { ssr: false })` — it requires browser window
- Mood colors and data defined in `src/types/vibe.ts` — single source of truth
- In-memory vibe store for demo mode; swap to Upstash Redis for production
- Framer Motion variants in `src/lib/animations.ts`
- Use `as const` for Framer Motion ease strings to satisfy strict types
