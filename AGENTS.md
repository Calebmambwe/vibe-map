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
- Real-time: Polling (Pusher-ready for production)

## Gotchas
- react-globe.gl MUST use `dynamic import` with `ssr: false` — Three.js needs browser window
- Framer Motion ease strings must use `as const` to satisfy TypeScript strict mode
- `ringColor` is NOT a valid CSS property — use `outlineColor` instead
- Globe ref type is `GlobeMethods | undefined` from `react-globe.gl`
- Zod v4 uses `zod/v4` import path
- Tailwind v4 uses `@import "tailwindcss"` instead of `@tailwind` directives

## Resolved Issues
- Fixed Globe ref type: use `useRef<GlobeMethods | undefined>(undefined)` not `useRef<unknown>`
- Fixed Framer Motion ease types: use `"easeOut" as const` not `"easeOut"`
- Fixed MoodSelector ring color: use `outlineColor` CSS property + `outline` class
