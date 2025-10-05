"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { verifyProjectOwnership, verifySceneOwnership } from "@/lib/projects/ownership";

export async function createCharacterAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("unauthorized");
  }

  const projectId = String(formData.get("projectId"));
  const ownership = await verifyProjectOwnership(projectId, user.id);
  if (!ownership.ok) {
    throw new Error(ownership.error);
  }

  const name = String(formData.get("name") ?? "Unnamed Character");
  const role = formData.get("role");
  const bio = formData.get("bio");

  await prisma.character.create({
    data: {
      projectId,
      name,
      role: typeof role === "string" && role.length > 0 ? role : undefined,
      bio: typeof bio === "string" && bio.length > 0 ? bio : undefined,
      tags: [],
      flaws: []
    }
  });

  revalidatePath("/app/projects/" + projectId);
}

export async function createSceneAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("unauthorized");
  }

  const projectId = String(formData.get("projectId"));
  const ownership = await verifyProjectOwnership(projectId, user.id);
  if (!ownership.ok) {
    throw new Error(ownership.error);
  }

  const title = String(formData.get("title") ?? "Untitled Scene");
  const intent = formData.get("intent");

  await prisma.scene.create({
    data: {
      projectId,
      title,
      intent: typeof intent === "string" && intent.length > 0 ? intent : undefined
    }
  });

  revalidatePath("/app/projects/" + projectId);
}

export async function createDraftAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("unauthorized");
  }

  const projectId = String(formData.get("projectId"));
  const ownership = await verifyProjectOwnership(projectId, user.id);
  if (!ownership.ok) {
    throw new Error(ownership.error);
  }

  const sceneRaw = formData.get("sceneId");
  let sceneId: string | undefined;
  if (typeof sceneRaw === "string" && sceneRaw.length > 0) {
    const sceneOwnership = await verifySceneOwnership(sceneRaw, user.id);
    if (!sceneOwnership.ok) {
      throw new Error(sceneOwnership.error);
    }
    if (sceneOwnership.record.projectId !== projectId) {
      throw new Error("scene_mismatch");
    }
    sceneId = sceneRaw;
  }

  const content = String(formData.get("content") ?? "");
  if (content.length === 0) {
    throw new Error("content_required");
  }

  await prisma.draft.create({
    data: {
      projectId,
      sceneId,
      contentMd: content,
      createdBy: user.id
    }
  });

  revalidatePath("/app/projects/" + projectId);
}
