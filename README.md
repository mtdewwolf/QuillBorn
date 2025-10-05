# QuillBorn Monorepo

QuillBorn is a production-ready scaffold for an AI-assisted writing studio. It ships with a Next.js 14 application, Prisma + Supabase integration, mocked AI pipelines, validator stubs, and CI/CD automation so you can expand from prototype to production without re-architecting.

## Repository layout

    /quillborn
    ├─ apps/web           # Next.js app deployed on Vercel
    ├─ packages/ui        # Shared shadcn/ui components + Tailwind tokens
    ├─ packages/types     # Domain types (StoryGraph, ContextPack, etc.)
    ├─ packages/config    # Shared ESLint, Prettier, tsconfig presets
    ├─ prisma             # Prisma schema, migrations, and seed script
    ├─ docs               # Architecture, environment, and roadmap guides
    └─ turbo.json         # Turborepo pipeline configuration

## Quickstart

1. Install dependencies

        pnpm install

2. Prepare environment

        cp .env.example .env.local

   Fill in Supabase, Stripe, and OpenRouter keys when available. Leaving them blank keeps the app in mock mode.

3. Database

        pnpm db:push          # or pnpm db:migrate
        pnpm ts-node prisma/seed.ts

4. Run the app

        pnpm dev

   Visit http://localhost:3000. Set NEXT_PUBLIC_DEMO=true to explore the seeded project without logging in.

### Workspace scripts

- pnpm dev — starts all dev servers via Turborepo
- pnpm build — builds every package and app
- pnpm lint — runs ESLint with the shared config
- pnpm format — formats with Prettier
- pnpm test — executes Vitest suites (types, API, component)
- pnpm typecheck — runs tsc --noEmit across workspaces
- pnpm db:push / pnpm db:migrate — Prisma schema sync and migrations
- pnpm db:studio — opens Prisma Studio

## Environment configuration

The app boots without secrets by falling back to mocked implementations. To enable real integrations:

- Supabase Auth and database: provide SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY. The dashboard and API routes use Supabase auth helpers plus Prisma.
- Stripe billing: set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to validate webhooks. Local development keeps billing mocked.
- OpenRouter: add OPENROUTER_API_KEY to switch the scene generator from lorem output to live LLM calls.
- Sentry and Langfuse: toggle telemetry by setting the DSN/keys alongside QUILLBORN_ENABLE_ANALYTICS=true.

See docs/ENV.md for a complete variable matrix and Vercel deployment checklist.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, import the project, choose pnpm, and set the root to apps/web.
3. Add environment variables from .env.example into Vercel (Project → Settings → Environment Variables).
4. Vercel runs pnpm install --frozen-lockfile followed by pnpm build, which triggers the Turborepo pipeline (typecheck, lint, test, build).
5. Connect Supabase (or Postgres) and update DATABASE_URL in Vercel.

## Feature highlights

- Supabase Auth: middleware protects /app/**. Server actions and API routes call Supabase helpers.
- Prisma domain schema: StoryBible entities (Character, Scene, RunLog, Subscription, etc.) with JSONB fields and pragmatic indexes.
- Mock-first AI pipeline: lib/context/composeScene builds minimal context packs; lib/llm/openrouter swaps between lorem output and live OpenRouter when keys exist; validators return deterministic scores.
- UI system: packages/ui exposes shadcn-based primitives (Button, Card, Tabs, Alert, Sheet) with Tailwind tokens.
- Collaboration hooks: SceneEditor wires a Yjs doc to local state and persists on blur.
- Dev experience: ESLint flat config, Prettier with Tailwind plugin, Vitest (type, API, component suites), Husky pre-commit, and GitHub Actions workflow.

## Next steps

- Implement ContextPack enrichment with scene recap logic.
- Replace validator stubs with production heuristics.
- Enable Stripe customer portal and plan upgrades.
- Add DOCX/EPUB export and branching diff UI for drafts.
- Instrument Langfuse and Sentry once secrets are available.
