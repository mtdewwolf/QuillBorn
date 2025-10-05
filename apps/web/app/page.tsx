import Link from "next/link";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@quillborn/ui";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-gradient-to-b from-background via-background to-secondary/30 px-6 py-24 text-center">
      <section className="max-w-2xl space-y-6">
        <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">AI Story Studio</span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Structure-first storytelling for teams that never break canon.
        </h1>
        <p className="text-lg text-muted-foreground">
          QuillBorn keeps your StoryBible, drafts, validators, and AI crafters in sync. A production-ready
          foundation with Supabase, Prisma, Stripe, and OpenRouter mock integrations so you can ship fast.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/auth/callback?provider=email">Start Writing</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/app">View Dashboard</Link>
          </Button>
        </div>
      </section>
      <Card className="max-w-3xl bg-card/80 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle>Agent Pipeline</CardTitle>
          <CardDescription>
            Narrative Architect → Context Composer → Scene Crafter → Validator Suite → Knowledge Curator
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-left text-sm text-muted-foreground md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">Mock friendly</h3>
            <p>Run locally with seeded data, mocked LLM outputs, and telemetry toggles until secrets are ready.</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Supabase native</h3>
            <p>Auth, storage, and database migrations wired via Prisma with GitHub Actions + Vercel deploy flows.</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Composable</h3>
            <p>Packages for UI, types, config, and domain logic ensure feature teams move fast without drift.</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Validator ready</h3>
            <p>Continuity, style, POV, and pacing validators stubbed with easy slots for future production logic.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
