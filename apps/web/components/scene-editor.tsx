"use client";

import React, { useEffect, useState } from "react";
import * as Y from "yjs";

import { Button } from "@quillborn/ui";

import { useYDoc } from "@/lib/collab/yjsClient";

interface SceneEditorProps {
  docId: string;
  projectId: string;
  sceneId?: string;
  initialValue: string;
  onSave?: (markdown: string) => Promise<void> | void;
}

async function defaultSave(projectId: string, sceneId: string | undefined, content: string) {
  await fetch("/api/story/drafts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ projectId, sceneId, content })
  });
}

export function SceneEditor({ docId, projectId, sceneId, initialValue, onSave }: SceneEditorProps) {
  const doc = useYDoc(docId);
  const text = doc.getText("root");
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    doc.transact(() => {
      text.delete(0, text.length);
      text.insert(0, initialValue);
    });

    const observer = () => {
      setValue(text.toString());
    };

    text.observe(observer);
    return () => {
      text.unobserve(observer);
    };
  }, [text, doc, initialValue]);

  async function handleSave() {
    const markdown = text.toString();
    if (markdown.trim().length === 0) {
      setStatus("idle");
      return;
    }

    setStatus("saving");
    try {
      if (onSave) {
        await onSave(markdown);
      } else {
        await defaultSave(projectId, sceneId, markdown);
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="grid gap-3">
      <textarea
        className="min-h-[240px] rounded-md border border-border bg-background px-3 py-2 text-sm"
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          doc.transact(() => {
            text.delete(0, text.length);
            text.insert(0, nextValue);
          });
        }}
        onBlur={handleSave}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Status: {status}</span>
        <Button type="button" size="sm" variant="outline" onClick={handleSave}>
          Save draft
        </Button>
      </div>
    </div>
  );
}




