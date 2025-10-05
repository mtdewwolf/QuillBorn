import Link from "next/link";

import { Button } from "@quillborn/ui";

import { getCurrentUser } from "@/lib/auth/helpers";
import { signOutAction } from "@/lib/auth/actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const signOutLabel = user ? "Sign out (" + (user.email ?? "user") + ")" : "Sign out";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/app" className="text-xl font-semibold">
            QuillBorn
          </Link>
          <nav className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link href="/app" className="hover:text-foreground">
              Projects
            </Link>
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                {signOutLabel}
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">{children}</main>
    </div>
  );
}
