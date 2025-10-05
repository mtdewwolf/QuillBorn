import Link from "next/link";
import type { Route } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@quillborn/ui";

const docLinks = [
  { href: "/docs/ARCHITECTURE" as Route, title: "Architecture", description: "Systems map for QuillBorn phases." },
  { href: "/docs/ENV" as Route, title: "Environment", description: "Secrets, Supabase, and Vercel config." },
  { href: "/docs/ROADMAP" as Route, title: "Roadmap", description: "Phase milestones and future upgrades." }
];

export default function DocsIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Documentation</h1>
        <p className="text-sm text-muted-foreground">
          Reference guides for architecture, environment setup, and roadmap planning.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {docLinks.map((link) => (
          <Card key={link.href}>
            <CardHeader>
              <CardTitle>{link.title}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={link.href} className="text-sm text-primary underline">
                View document
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


