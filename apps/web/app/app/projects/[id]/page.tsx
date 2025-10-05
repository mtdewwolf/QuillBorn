import { notFound } from "next/navigation";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@quillborn/ui";

import { SceneEditor } from "@/components/scene-editor";
import { getProjectDetail } from "@/lib/projects/detail";
import { createCharacterAction, createDraftAction, createSceneAction } from "@/lib/story/actions";
import { getCurrentUser } from "@/lib/auth/helpers";
import { GenerateDraftButton } from "./components/generate-draft-button";

interface ProjectPageProps {
  params: { id: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await getCurrentUser();
  const project = await getProjectDetail(params.id, user?.id ?? undefined);

  if (!user || !project) {
    notFound();
  }

  const userId = user.id;
  const primaryScene = project.scenes[0];
  const primaryDraft = primaryScene?.drafts[0]?.contentMd ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">{project.title}</h1>
        <p className="text-sm text-muted-foreground">{project.description ?? "No description yet."}</p>
      </div>
      <Tabs defaultValue="storybible" className="space-y-6">
        <TabsList>
          <TabsTrigger value="storybible">StoryBible</TabsTrigger>
          <TabsTrigger value="plot">Plot</TabsTrigger>
          <TabsTrigger value="scenes">Scenes</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="storybible" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Characters</CardTitle>
              <CardDescription>Cast, arcs, and continuity anchors.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {project.characters.map((character) => (
                <Card key={character.id} className="border-muted">
                  <CardHeader>
                    <CardTitle>{character.name}</CardTitle>
                    <CardDescription>{character.role ?? "Role TBD"}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {character.bio ?? "No bio yet."}
                  </CardContent>
                </Card>
              ))}
              {project.characters.length === 0 && (
                <Alert>
                  <AlertTitle>No characters yet</AlertTitle>
                  <AlertDescription>Use the composer to add your first hero or antagonist.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Add a character</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createCharacterAction} className="grid gap-3">
                <input type="hidden" name="projectId" value={project.id} />
                <input
                  name="name"
                  placeholder="Name"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  required
                />
                <input
                  name="role"
                  placeholder="Role"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <textarea
                  name="bio"
                  placeholder="Bio"
                  className="min-h-[120px] rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <Button type="submit">Save character</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="plot" className="space-y-4">
          <Alert>
            <AlertTitle>Plot roadmap coming soon</AlertTitle>
            <AlertDescription>
              Beats, arcs, and checklist validators will live here. Use the Scenes tab to capture structure.
            </AlertDescription>
          </Alert>
        </TabsContent>
        <TabsContent value="scenes" className="grid gap-4 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {project.scenes.map((scene) => {
              const flags = scene.flags ?? [];
              return (
                <Card key={scene.id}>
                  <CardHeader>
                    <CardTitle>{scene.title}</CardTitle>
                    <CardDescription>{scene.intent ?? "Intent TBD"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">Flags: {flags.length ? flags.join(", ") : "None"}</div>
                    <div className="text-xs text-muted-foreground">
                      Drafts: {scene.drafts.length} · Updated {scene.updatedAt.toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {project.scenes.length === 0 && (
              <Alert>
                <AlertTitle>No scenes yet</AlertTitle>
                <AlertDescription>Create a scene to begin structuring chapters and drafts.</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add a scene</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={createSceneAction} className="grid gap-3">
                  <input type="hidden" name="projectId" value={project.id} />
                  <input
                    name="title"
                    placeholder="Scene title"
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    required
                  />
                  <textarea
                    name="intent"
                    placeholder="Intent"
                    className="min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <Button type="submit">Save scene</Button>
                </form>
              </CardContent>
            </Card>
            {project.scenes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generate draft</CardTitle>
                  <CardDescription>Mocked OpenRouter integration without secrets.</CardDescription>
                </CardHeader>
                <CardContent>
                  <GenerateDraftButton projectId={project.id} sceneId={project.scenes[0].id} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="drafts" className="grid gap-4 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {project.drafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader>
                  <CardTitle>{draft.sceneId ? "Scene Draft" : "Loose Draft"}</CardTitle>
                  <CardDescription>Created {draft.createdAt.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded bg-muted/40 p-3 text-xs">
                    {draft.contentMd}
                  </pre>
                </CardContent>
              </Card>
            ))}
            {project.drafts.length === 0 && (
              <Alert>
                <AlertTitle>No drafts yet</AlertTitle>
                <AlertDescription>Create a draft using the composer. AI generators plug in next.</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick draft</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={createDraftAction} className="grid gap-3">
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="userId" value={userId} />
                  <select
                    name="sceneId"
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    defaultValue=""
                  >
                    <option value="">No scene</option>
                    {project.scenes.map((scene) => (
                      <option key={scene.id} value={scene.id}>
                        {scene.title}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="content"
                    placeholder="Markdown draft content"
                    className="min-h-[160px] rounded-md border border-border bg-background px-3 py-2 text-sm"
                    required
                  />
                  <Button type="submit">Save draft</Button>
                </form>
              </CardContent>
            </Card>
            {primaryScene && (
              <Card>
                <CardHeader>
                  <CardTitle>Scene editor</CardTitle>
                  <CardDescription>Local Yjs doc persisted via the drafts API.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SceneEditor
                    docId={"scene-" + primaryScene.id}
                    projectId={project.id}
                    sceneId={primaryScene.id}
                    initialValue={primaryDraft}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Project settings</CardTitle>
              <CardDescription>Stripe plans, validators, and context builders wire in here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Plan: Free tier (upgrade flow mocked)</p>
              <p>Validators: Continuity, Style, POV, Pace — all stubbed with deterministic responses.</p>
              <p>Context Composer: pulls StoryBible entities and last two scenes.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
