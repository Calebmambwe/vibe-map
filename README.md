# VibeMap

**Drop your vibe on the globe. See how the world feels right now.**

VibeMap is a real-time 3D mood globe where anyone can share how they're feeling and watch vibes pulse across the planet. Select a mood, drop it on the map, and see the collective emotional state of the world — live.

![VibeMap Screenshot](public/og-image.png)

## Features

- **3D Interactive Globe** — explore vibes on a rotating earth powered by Three.js
- **6 Moods** — Happy, Excited, Calm, Tired, Sad, Angry — each with unique colors and animations
- **Real-time Updates** — see new vibes appear instantly via Pusher WebSockets
- **Global Mood Stats** — live breakdown of how the world is feeling
- **Geolocation** — automatically detects your city and country
- **Heatmap Mode** — toggle between pin markers and heatmap visualization
- **Dark Theme** — beautiful dark UI with glass morphism effects
- **Mobile Responsive** — works on desktop, tablet, and phone
- **PWA Ready** — installable as a native app

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| 3D Globe | [react-globe.gl](https://github.com/vasturiano/react-globe.gl) + [Three.js](https://threejs.org/) |
| Database | [Upstash Redis](https://upstash.com/) |
| Real-time | [Pusher](https://pusher.com/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Validation | [Zod](https://zod.dev/) |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |
| Language | TypeScript (strict mode) |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### 1. Clone and install

```bash
git clone https://github.com/Calebmambwe/vibe-map.git
cd vibe-map
pnpm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

You'll need:
- **Upstash Redis** — [create a free database](https://upstash.com/) and copy the REST URL + token
- **Pusher** (optional) — [create a free app](https://pusher.com/) for real-time updates

### 3. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and drop your first vibe!

## Project Structure

```
src/
  app/              # Next.js pages and API routes
    api/vibe/       # POST/GET vibe endpoints
  components/
    globe/          # 3D globe rendering
    mood/           # Mood selection UI
    stats/          # Statistics dashboard
    shared/         # Buttons, modals, particles
  hooks/            # useVibes, useGeolocation, useVibeStreak
  lib/              # Utilities, animations, rate limiting
  types/            # TypeScript type definitions
```

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript compiler checks
pnpm test         # Run tests
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick links:**
- [Good first issues](https://github.com/Calebmambwe/vibe-map/labels/good%20first%20issue)
- [Feature requests](https://github.com/Calebmambwe/vibe-map/labels/enhancement)
- [Bug reports](https://github.com/Calebmambwe/vibe-map/issues/new?template=bug_report.md)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Calebmambwe/vibe-map&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN)

Or deploy anywhere that supports Next.js.

## License

[MIT](LICENSE) — use it, fork it, vibe with it.
