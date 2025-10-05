# Environment and Deployment

QuillBorn relies on a small set of environment variables. The app works in mock mode when secrets are absent, so local development is frictionless.

## Local development

Copy .env.example to .env.local at the repository root.

- NEXT_PUBLIC_APP_URL — defaults to http://localhost:3000.
- NEXT_PUBLIC_DEMO — when true, enables seeded demo access without authentication.
- DATABASE_URL — Postgres connection string. Use Supabase or a local Postgres instance.
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY — Supabase credentials. The anon key is exposed to the browser; the service key should only exist on the server.
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY — browser safe Supabase values (often identical to the server values).
- SUPABASE_JWT_SECRET — optional when using Supabase Auth with custom JWT validation.
- STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET — enable Stripe billing flows. Without them the billing routes stay mocked.
- OPENROUTER_API_KEY — unlocks live scene generation via OpenRouter. Absent keys return deterministic mock drafts.
- SENTRY_DSN, LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY — enable telemetry when QUILLBORN_ENABLE_ANALYTICS=true.
- QUILLBORN_ENABLE_BILLING — feature flag for billing UI components.
- QUILLBORN_ENABLE_ANALYTICS — disables telemetry when false (the default).

## Database commands

- pnpm db:push — apply schema changes without generating migrations (great for local prototyping).
- pnpm db:migrate — create and apply migrations in development.
- pnpm db:studio — open Prisma Studio.
- pnpm ts-node prisma/seed.ts — seed a demo user and project.

## Vercel deployment

1. Import the repository, set the framework to Next.js, and choose pnpm as the package manager.
2. Configure the root directory (apps/web) and keep the build command as pnpm build. Vercel automatically runs pnpm install --frozen-lockfile.
3. Add environment variables in three environments (Development, Preview, Production). Use Supabase managed secrets or Vercel encrypted values.
4. Set NEXT_PUBLIC_APP_URL for each environment. Example: https://quillborn.vercel.app.
5. Connect DATABASE_URL to your Supabase instance. Use Supabase connection pooling if you plan to run intensive workloads.
6. Optional: configure STRIPE_WEBHOOK_SECRET in Vercel and point Stripe webhooks to https://your-domain/api/billing/webhook.

## GitHub Actions

The CI workflow runs lint, typecheck, test, and build on every push. Provide a Supabase service role key and database URL using repository secrets if you plan to run integration tests that touch the database.
