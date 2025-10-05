import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { verifyCharacterOwnership } from "@/lib/projects/ownership";

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

function buildCharacterUpdate(payload: any) {
  const update: Record<string, unknown> = {};

  if (typeof payload.name === "string") {
    const name = payload.name.trim();
    if (name.length > 0) {
      update.name = name;
    }
  }
  if (typeof payload.role === "string") {
    const role = payload.role.trim();
    update.role = role.length > 0 ? role : null;
  }
  if (typeof payload.bio === "string") {
    const bio = payload.bio.trim();
    update.bio = bio.length > 0 ? bio : null;
  } else if (payload.bio === null) {
    update.bio = null;
  }

  const tags = toStringArray(payload.tags);
  if (tags.length > 0 || Array.isArray(payload.tags)) update.tags = tags;

  const flaws = toStringArray(payload.flaws);
  if (flaws.length > 0 || Array.isArray(payload.flaws)) update.flaws = flaws;

  const jsonFields = ["goals", "relationships", "arc", "continuity"] as const;

  for (const key of jsonFields) {
    const value = toJsonValue(payload[key]);
    if (value !== undefined || payload[key] === null) {
      update[key] = value ?? null;
    }
  }

  return update;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifyCharacterOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  return NextResponse.json({ character: ownership.record });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifyCharacterOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const payload = await req.json();
  const data = buildCharacterUpdate(payload);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "no_allowed_fields" }, { status: 400 });
  }

  const character = await prisma.character.update({
    where: { id: params.id },
    data
  });

  return NextResponse.json({ character });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifyCharacterOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  await prisma.character.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
