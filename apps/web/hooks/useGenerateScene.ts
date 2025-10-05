"use client";

import { useState } from "react";

import { useAppStore } from "@/store/app-store";

interface GenerateOptions {
  projectId: string;
  sceneId: string;
}

export function useGenerateSceneDraft() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setLastGeneratedDraft = useAppStore((state) => state.setLastGeneratedDraft);

  async function generate(options: GenerateOptions) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate/scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        throw new Error("Failed to generate draft");
      }

      const data = await response.json();
      const draft = data.draft ?? "";
      setLastGeneratedDraft(draft);
      return draft;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { generate, isLoading, error };
}
