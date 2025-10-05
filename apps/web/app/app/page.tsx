import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@quillborn/ui";

import { createProjectAction } from "@/lib/projects/actions";
import { getProjectsForUser } from "@/lib/projects/queries";
import { getCurrentUser } from "@/lib/auth/helpers";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const projects = await getProjectsForUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Your projects</h1>
        <p className="text-sm text-muted-foreground">Story worlds, drafts, and validators live here.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create a project</CardTitle>
          <CardDescription>Kickstart a new universe with StoryBible, scenes, and AI helpers.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProjectAction} className="flex flex-col gap-3 sm:flex-row">
            <input
              name="title"
              type="text"
              placeholder="Project title"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              required
            />
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
      <section className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="border-primary/20">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>Updated {project.updatedAt.toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Slug: {project.slug}</div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/app/projects/${project.id}` as Route}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                Use the form above to create your first StoryBible. Seed data is available when running locally.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </section>
    </div>
  );
}

