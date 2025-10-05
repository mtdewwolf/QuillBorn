import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { verifyProjectOwnership } from "@/lib/projects/ownership";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string");
}

function toJsonValue(value: unknown) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "object") {
    return value;
  }
  return undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifyProjectOwnership(projectId, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const characters = await prisma.character.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ characters });
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (typeof payload.projectId !== "string" || typeof payload.name !== "string") {
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

  const name = payload.name.trim();
  if (name.length === 0) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const character = await prisma.character.create({
    data: {
      projectId: payload.projectId,
      name,
      role: typeof payload.role === "string" ? payload.role : undefined,
      bio: typeof payload.bio === "string" ? payload.bio : undefined,
      tags: toStringArray(payload.tags),
      flaws: toStringArray(payload.flaws),
      goals: toJsonValue(payload.goals),
      relationships: toJsonValue(payload.relationships),
      arc: toJsonValue(payload.arc),
      continuity: toJsonValue(payload.continuity)
    }
  });

  return NextResponse.json({ character }, { status: 201 });
}
