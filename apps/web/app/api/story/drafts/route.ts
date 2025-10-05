import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { verifyProjectOwnership, verifySceneOwnership } from "@/lib/projects/ownership";

export async function POST(request: Request) {
  const payload = await request.json();
  if (typeof payload.projectId !== "string" || typeof payload.content !== "string") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifyProjectOwnership(payload.projectId, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  let sceneId: string | undefined;
  if (payload.sceneId !== undefined && payload.sceneId !== null) {
    if (typeof payload.sceneId !== "string") {
      return NextResponse.json({ error: "invalid_scene" }, { status: 400 });
    }
    const sceneOwnership = await verifySceneOwnership(payload.sceneId, user.id);
    if (!sceneOwnership.ok) {
      return NextResponse.json({ error: sceneOwnership.error }, { status: sceneOwnership.status });
    }
    if (sceneOwnership.record.projectId !== payload.projectId) {
      return NextResponse.json({ error: "scene_mismatch" }, { status: 400 });
    }
    sceneId = payload.sceneId;
  }

  const draft = await prisma.draft.create({
    data: {
      projectId: payload.projectId,
      sceneId,
      contentMd: payload.content,
      createdBy: user.id
    }
  });

  return NextResponse.json({ draft }, { status: 201 });
}
