import { beforeEach, describe, expect, it, vi } from "vitest";

const subscriptionMock = vi.fn(async () => null);
const runCreateMock = vi.fn(async () => ({}));
const projectFindUniqueMock = vi.fn(async () => ({ ownerId: "user_1" }));
const sceneFindUniqueMock = vi.fn(async () => ({
  id: "scene_1",
  projectId: "proj_1",
  project: { ownerId: "user_1" }
}));

vi.mock("@/lib/auth/helpers", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "user_1" }))
}));

vi.mock("@/lib/context/composeScene", () => ({
  composeSceneContext: vi.fn(async () => ({
    scene: { title: "Test Scene", beats: ["Conflict"] },
    pov: { character: "Aria" },
    characters: [],
    location: null,
    loreRules: []
  }))
}));

vi.mock("@/lib/llm/openrouter", () => ({
  generateSceneDraft: vi.fn(async () => "Generated draft text")
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      findFirst: subscriptionMock
    },
    project: {
      findUnique: projectFindUniqueMock
    },
    scene: {
      findUnique: sceneFindUniqueMock
    },
    run: {
      create: runCreateMock
    }
  }
}));

const { POST } = await import("./route");

describe("POST /api/generate/scene", () => {
  beforeEach(() => {
    subscriptionMock.mockClear();
    runCreateMock.mockClear();
    projectFindUniqueMock.mockClear();
    sceneFindUniqueMock.mockClear();
  });

  it("returns mock draft", async () => {
    const request = new Request("http://localhost/api/generate/scene", {
      method: "POST",
      body: JSON.stringify({ projectId: "proj_1", sceneId: "scene_1" })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.draft).toContain("Generated draft text");
    expect(subscriptionMock).toHaveBeenCalled();
    expect(runCreateMock).toHaveBeenCalled();
  });
});
