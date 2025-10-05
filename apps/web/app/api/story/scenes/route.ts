import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import {
  verifyCharacterOwnership,
  verifyLocationOwnership,
  verifyProjectOwnership
} from "@/lib/projects/ownership";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string");
}

function toNullableString(value: unknown) {
  if (value === null) {
    return null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
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

  const scenes = await prisma.scene.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { drafts: { take: 3, orderBy: { createdAt: "desc" } } }
  });

  return NextResponse.json({ scenes });
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (typeof payload.projectId !== "string" || typeof payload.title !== "string") {
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

  let locationId: string | undefined;
  if (typeof payload.locationId === "string") {
    const locationOwnership = await verifyLocationOwnership(payload.locationId, user.id);
    if (!locationOwnership.ok) {
      return NextResponse.json({ error: locationOwnership.error }, { status: locationOwnership.status });
    }
    if (locationOwnership.record.projectId !== payload.projectId) {
      return NextResponse.json({ error: "location_mismatch" }, { status: 400 });
    }
    locationId = payload.locationId;
  }

  let pov: string | undefined;
  if (typeof payload.pov === "string") {
    const characterOwnership = await verifyCharacterOwnership(payload.pov, user.id);
    if (!characterOwnership.ok) {
      return NextResponse.json({ error: characterOwnership.error }, { status: characterOwnership.status });
    }
    if (characterOwnership.record.projectId !== payload.projectId) {
      return NextResponse.json({ error: "character_mismatch" }, { status: 400 });
    }
    pov = payload.pov;
  }

  const title = payload.title.trim();
  if (title.length === 0) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const intent = toNullableString(payload.intent);
  const outcome = toNullableString(payload.outcome);

  const scene = await prisma.scene.create({
    data: {
      projectId: payload.projectId,
      title,
      intent: intent === undefined ? undefined : intent,
      outcome: outcome === undefined ? undefined : outcome,
      pov,
      locationId,
      beats: toStringArray(payload.beats),
      flags: toStringArray(payload.flags)
    }
  });

  return NextResponse.json({ scene }, { status: 201 });
}
