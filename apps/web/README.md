# QuillBorn Web App

This Next.js 14 application is the primary surface for the QuillBorn writing studio. It uses the App Router, Supabase Auth, Prisma, Tailwind, shadcn/ui, and mocked integrations for OpenRouter, Stripe, and Langfuse.

## Development

1. Install dependencies from the repository root with pnpm install.
2. Copy .env.example to .env.local and configure Supabase credentials. Leaving secrets blank keeps the app in mock mode.
3. Push the Prisma schema: pnpm db:push.
4. Seed demo data with pnpm ts-node prisma/seed.ts.
5. Start the dev server from the repo root with pnpm dev. The app runs at http://localhost:3000.

## Conventions

- UI primitives live in packages/ui and are imported via the workspace alias @quillborn/ui.
- Shared domain types live in packages/types.
- API routes under app/api use Prisma and Supabase helpers. They are safe to deploy to Vercel edge/serverless.
- Client state is kept minimal with Zustand stores. Complex flows should prefer server actions or Supabase RPC.

## Testing

Run pnpm test from the repo root. Vitest is configured with jsdom and ships with sample suites for types, API handlers, and React components.

## Deployment notes

- Ensure DATABASE_URL, SUPABASE_URL, and SUPABASE_ANON_KEY are set in the environment.
- OPENROUTER_API_KEY and STRIPE secrets are optional; without them, the app relies on deterministic mocks.
- Sentry and Langfuse only initialise when QUILLBORN_ENABLE_ANALYTICS=true and the relevant keys are supplied.
