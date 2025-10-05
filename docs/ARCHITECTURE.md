# QuillBorn Architecture

QuillBorn is organised as a Turborepo monorepo. Each phase of development layers new capabilities while keeping the bootstrap deployable.

## Packages and apps

- apps/web — Next.js 14 app with App Router, server actions, Supabase auth helpers, Prisma, and mocked AI services.
- packages/ui — shadcn/ui based design system shared across surfaces. Exposes Button, Card, Tabs, Alert, Sheet, and utility helpers.
- packages/types — StoryGraph, ContextPack, and related narrative domain types.
- packages/config — Centralised ESLint, Prettier, and TypeScript presets.
- prisma — schema.prisma, migrations, and seed scripts. Targets Postgres (Supabase) with JSONB rich entities.

## Data model highlights

Characters, Scenes, Drafts, Beats, Lore, and Run logs are all scoped to a Project. Flexible JSONB fields capture canon, validator output, and ContextPack payloads without forcing early schema changes. Pragmatic indexes support dashboards and validators.

## Runtime flow

1. Supabase session middleware protects /app routes.
2. Server components and actions fetch data via Prisma. Zustand stores keep client state light.
3. Context packs are composed from Prisma entities (characters, lore, recent scenes).
4. Scene generation routes call lib/llm/openrouter, returning deterministic mock output unless OPENROUTER_API_KEY is provided.
5. Validator routes (continuity, style, POV, pace) return scored stubs that will later host production logic.
6. Run entries persist every AI call for replayability and debugging.

## Agent pipeline stubs

- Context Composer (lib/context/composeScene) prepares inputs for generation.
- Scene Crafter (lib/llm/openrouter) generates drafts with OpenRouter or mocks.
- Validator suite (lib/validators) scores drafts.
- Knowledge logging (prisma.run) records events for future agent coordination.

## Phase layering

- Phase 0: Bootstrap (Next.js, Tailwind, shadcn/ui, Prisma, Supabase auth, middleware, seeded demo project).
- Phase 1: Product skeleton (StoryBible tabs, domain API routes, shared types, basic CRUD server actions).
- Phase 2: Dev workflow (eslint, prettier, vitest, GitHub Actions, docs, telemetry toggles).
- Phase 3: Feature stubs (OpenRouter adapter, Context Composer, Validator mocks, Stripe plan guard, Yjs editor wiring).

This structure keeps the application deployable to Vercel from day one while enabling vertical feature teams to expand agents, validator logic, billing, and collaboration without untangling the foundation.
