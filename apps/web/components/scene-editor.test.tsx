import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SceneEditor } from "./scene-editor";

global.fetch = vi.fn(async () => ({ ok: true })) as unknown as typeof fetch;

describe("SceneEditor", () => {
  it("persists on blur", async () => {
    const handleSave = vi.fn();
    render(
      <SceneEditor
        docId="test"
        projectId="proj_1"
        sceneId="scene_1"
        initialValue="Hello"
        onSave={handleSave}
      />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Updated text" } });
    fireEvent.blur(textarea);

    await waitFor(() => expect(handleSave).toHaveBeenCalled());
  });
});

