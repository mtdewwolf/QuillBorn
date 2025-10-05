export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <h1 className="text-3xl font-semibold">Lost in the story</h1>
      <p className="text-sm text-muted-foreground">
        We couldn't find that page. Return to the dashboard to continue authoring your universe.
      </p>
      <a href="/app" className="text-sm font-medium text-primary underline">
        Back to dashboard
      </a>
    </main>
  );
}
