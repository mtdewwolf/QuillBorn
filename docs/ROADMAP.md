# Roadmap

## Phase 0 — Bootstrap

- Monorepo scaffolding with pnpm + Turborepo.
- Next.js 14 App Router, Tailwind, shadcn/ui primitives.
- Supabase auth boilerplate (server helpers, client hooks, middleware).
- Prisma schema with StoryBible tables and initial migration.
- Seed script for demo user and project.
- App shell with marketing landing page and protected dashboard.

## Phase 1 — Product skeleton

- Shared StoryGraph types and Prisma models for characters, lore, beats, scenes, drafts, checklists, runs, subscriptions.
- API routes for projects, story entities, generation, validators, and Stripe webhooks (mocked).
- Dashboard tabs: StoryBible, Plot, Scenes, Drafts, Settings.
- Forms to create characters, scenes, and drafts backed by server actions.

## Phase 2 — Developer workflow

- ESLint flat config, Prettier + Tailwind plugin, TypeScript strict preset.
- Vitest setup with sample tests for types, API handlers, and UI components.
- GitHub Actions workflow: install, typecheck, lint, test, build.
- Husky pre-commit with lint-staged.
- Architecture, environment, and roadmap documentation.

## Phase 3 — Feature stubs

- Context composer building minimal ContextPack payloads.
- OpenRouter adapter with mock fallback.
- Validator suite stubs (continuity, style, POV, pace).
- Stripe plan registry and guard helpers.
- Yjs-powered SceneEditor component with mocked persistence.
- Langfuse and Sentry toggles that no-op without secrets.

## Guided expansion (post scaffold)

- ContextPack enrichment with recaps of the latest scenes.
- Validator heuristics for canon checks and stylistic feedback.
- Stripe billing flows (portal, invoices, plan upgrades).
- Export pipelines (DOCX, EPUB) and draft branching UI.
- Usage metering to track LLM tokens per plan.
