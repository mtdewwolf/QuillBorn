import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import {
  verifyCharacterOwnership,
  verifyLocationOwnership,
  verifySceneOwnership
} from "@/lib/projects/ownership";

interface RouteContext {
  params: { id: string };
}

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

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifySceneOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const payload = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof payload.title === "string") {
    const title = payload.title.trim();
    if (title.length > 0) {
      data.title = title;
    }
  }
  const intent = toNullableString(payload.intent);
  if (intent !== undefined) data.intent = intent;
  const outcome = toNullableString(payload.outcome);
  if (outcome !== undefined) data.outcome = outcome;
  const summary = toNullableString(payload.summary);
  if (summary !== undefined) data.summary = summary;

  const beats = toStringArray(payload.beats);
  if (beats.length > 0 || Array.isArray(payload.beats)) data.beats = beats;
  const flags = toStringArray(payload.flags);
  if (flags.length > 0 || Array.isArray(payload.flags)) data.flags = flags;

  const metadata = toJsonValue(payload.metadata);
  if (metadata !== undefined || payload.metadata === null) {
    data.metadata = metadata ?? null;
  }

  if (payload.locationId !== undefined) {
    if (payload.locationId === null) {
      data.locationId = null;
    } else if (typeof payload.locationId === "string") {
      const locationOwnership = await verifyLocationOwnership(payload.locationId, user.id);
      if (!locationOwnership.ok) {
        return NextResponse.json({ error: locationOwnership.error }, { status: locationOwnership.status });
      }
      if (locationOwnership.record.projectId !== ownership.record.projectId) {
        return NextResponse.json({ error: "location_mismatch" }, { status: 400 });
      }
      data.locationId = payload.locationId;
    }
  }

  if (payload.pov !== undefined) {
    if (payload.pov === null) {
      data.pov = null;
    } else if (typeof payload.pov === "string") {
      const characterOwnership = await verifyCharacterOwnership(payload.pov, user.id);
      if (!characterOwnership.ok) {
        return NextResponse.json({ error: characterOwnership.error }, { status: characterOwnership.status });
      }
      if (characterOwnership.record.projectId !== ownership.record.projectId) {
        return NextResponse.json({ error: "character_mismatch" }, { status: 400 });
      }
      data.pov = payload.pov;
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "no_allowed_fields" }, { status: 400 });
  }

  const scene = await prisma.scene.update({
    where: { id: params.id },
    data
  });

  return NextResponse.json({ scene });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifySceneOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  await prisma.scene.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
