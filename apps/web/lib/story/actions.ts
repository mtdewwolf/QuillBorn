"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function createCharacterAction(formData: FormData) {
  const projectId = String(formData.get("projectId"));
  const name = String(formData.get("name") ?? "Unnamed Character");
  const role = formData.get("role") ? String(formData.get("role")) : null;
  const bio = formData.get("bio") ? String(formData.get("bio")) : null;

  await prisma.character.create({
    data: {
      projectId,
      name,
      role: role ?? undefined,
      bio: bio ?? undefined,
      tags: [],
      flaws: []
    }
  });

  revalidatePath("/app/projects/" + projectId);
}

export async function createSceneAction(formData: FormData) {
  const projectId = String(formData.get("projectId"));
  const title = String(formData.get("title") ?? "Untitled Scene");
  const intent = formData.get("intent") ? String(formData.get("intent")) : undefined;

  await prisma.scene.create({
    data: {
      projectId,
      title,
      intent
    }
  });

  revalidatePath("/app/projects/" + projectId);
}

export async function createDraftAction(formData: FormData) {
  const projectId = String(formData.get("projectId"));
  const sceneId = formData.get("sceneId") ? String(formData.get("sceneId")) : null;
  const content = String(formData.get("content") ?? "");
  const createdBy = String(formData.get("userId") ?? "demo");

  await prisma.draft.create({
    data: {
      projectId,
      sceneId: sceneId ?? undefined,
      contentMd: content,
      createdBy
    }
  });

  revalidatePath("/app/projects/" + projectId);
}
