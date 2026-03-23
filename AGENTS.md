<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — VibeMap

## Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4
- 3D: react-globe.gl (Three.js wrapper)
- Animation: Framer Motion
- Audio: Web Audio API (no external deps)
- Real-time: Polling every 5s (Ably recommended for Phase 2)
- Geocoding: BigDataCloud (client-side, free, no key)
- Icons: lucide-react

## Gotchas
- react-globe.gl MUST use `dynamic import` with `ssr: false` — Three.js needs browser window
- Framer Motion ease strings must use `as const` to satisfy TypeScript strict mode (e.g. `"easeOut" as const`)
- `ringColor` is NOT a valid CSS property — use `outlineColor` instead for dynamic ring colors
- Globe ref type is `GlobeMethods | undefined` from `react-globe.gl` — never use `unknown`
- Zod v4 uses `zod/v4` import path (not bare `zod`)
- Tailwind v4 uses `@import "tailwindcss"` instead of `@tailwind` directives
- Next.js 16 metadata: `themeColor` should be in `viewport` export, not `metadata` export
- BigDataCloud's free reverse geocode endpoint is client-side only — ToS prohibits server-side use. For server-side geocoding, use Nominatim (no key, free, 1 req/sec)
- Web Audio API requires user gesture before first play — wrap in try/catch
- Globe's `pointOfView(pos, ms)` with `ms > 0` animates with built-in easing — no GSAP needed for simple fly-tos
- `react-hooks/set-state-in-effect` lint rule: avoid `setState` inside `useEffect` — use `useMemo` for derived state instead
- Globe heatmap layer uses `heatmapsData` (array of arrays), not `heatmapData`

## Resolved Issues
- Fixed Globe ref type: use `useRef<GlobeMethods | undefined>(undefined)` not `useRef<unknown>`
- Fixed Framer Motion ease types: use `"easeOut" as const` not `"easeOut"`
- Fixed MoodSelector ring color: use `outlineColor` CSS property + `outline` class
- Fixed ParticleBurst lint: replaced `useEffect` + `setState` with `useMemo` for particle generation
- PWA icons: generated via OG image API endpoint + macOS `sips` resize

## Architecture Decisions
- In-memory vibe store for demo mode (no Redis required) — swap to Upstash Redis for production
- In-memory rate limiter (per-process) — swap to `@upstash/ratelimit` for multi-instance
- Polling (5s interval) instead of WebSockets for MVP simplicity — swap to Ably for Phase 2
- Seed data: 15 cities worldwide with random moods for immediate visual impact on first load
