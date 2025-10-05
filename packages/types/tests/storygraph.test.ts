import { describe, expect, it } from "vitest";

import { type Character } from "@quillborn/types";

describe("StoryGraph types", () => {
  it("accepts well shaped Character", () => {
    const character: Character = {
      id: "char_1",
      projectId: "proj_1",
      name: "Aria Novak",
      role: "Captain",
      tags: ["leader"],
      flaws: ["Impulsive"],
      goals: { main: "Protect crew" },
      continuity: { status: "alive" }
    };

    expect(character.name).toBe("Aria Novak");
    expect(character.tags).toContain("leader");
  });
});
