# Contributing to VibeMap

Thanks for your interest in contributing to VibeMap! This guide will help you get started.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [Upstash Redis](https://upstash.com/) account (free tier works)
- [Pusher](https://pusher.com/) account (free tier works) — optional, for real-time updates

### Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/vibe-map.git
   cd vibe-map
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Upstash Redis and Pusher credentials (see `.env.example` for details).

4. **Start the dev server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure quality:
   ```bash
   pnpm lint        # ESLint
   pnpm typecheck   # TypeScript
   pnpm test        # Vitest
   ```

3. **Commit** using [conventional commits](https://www.conventionalcommits.org/):
   ```
   feat: add mood history chart
   fix: prevent duplicate vibe submissions
   docs: update setup instructions
   ```

4. **Push and open a PR** against `main`.

## What Can I Contribute?

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/Calebmambwe/vibe-map/labels/good%20first%20issue).

### Ideas We'd Love Help With

- **New moods** — add emoji + color + label to `src/types/vibe.ts`
- **Accessibility** — screen reader support, keyboard navigation
- **Internationalization** — translate mood labels and UI text
- **Mobile UX** — improve touch interactions on the globe
- **Data visualizations** — mood trends over time, regional breakdowns
- **Performance** — optimize Three.js rendering, reduce bundle size
- **Tests** — increase coverage for hooks, components, and API routes

## Project Structure

```
src/
  app/           # Next.js App Router pages and API routes
  components/    # React components organized by feature
    globe/       # 3D globe (react-globe.gl)
    mood/        # Mood selector
    stats/       # Statistics panel
    shared/      # Shared UI components
  hooks/         # Custom React hooks
  lib/           # Utilities, animations, sounds
  types/         # TypeScript types
```

## Code Standards

- **TypeScript** — no `any` types. Use `unknown` + type guards.
- **Formatting** — Prettier handles this automatically.
- **Components** — use named exports, keep components focused.
- **State** — colocate state as close to where it's used as possible.

## Need Help?

- Open an issue for questions or bugs
- Tag `@Calebmambwe` in your PR for review

We appreciate every contribution, big or small!
