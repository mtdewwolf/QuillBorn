"use client";

import { useState } from "react";

import { Button } from "@quillborn/ui";

import { useGenerateSceneDraft } from "@/hooks/useGenerateScene";
import { useAppStore } from "@/store/app-store";

interface GenerateDraftButtonProps {
  projectId: string;
  sceneId: string;
}

export function GenerateDraftButton({ projectId, sceneId }: GenerateDraftButtonProps) {
  const { generate, isLoading, error } = useGenerateSceneDraft();
  const lastDraft = useAppStore((state) => state.lastGeneratedDraft);
  const [previewVisible, setPreviewVisible] = useState(false);

  async function handleClick() {
    const draft = await generate({ projectId, sceneId });
    if (draft) {
      setPreviewVisible(true);
    }
  }

  return (
    <div className="space-y-3">
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate mock draft"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {previewVisible && lastDraft && (
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded border border-border bg-muted/40 p-3 text-xs">
          {lastDraft}
        </pre>
      )}
    </div>
  );
}
