import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { verifyLocationOwnership } from "@/lib/projects/ownership";

interface RouteContext {
  params: { id: string };
}

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

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifyLocationOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const payload = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof payload.name === "string") {
    const name = payload.name.trim();
    if (name.length > 0) {
      data.name = name;
    }
  }

  const sensory = toStringArray(payload.sensory);
  if (sensory.length > 0 || Array.isArray(payload.sensory)) data.sensory = sensory;

  const constraints = toStringArray(payload.constraints);
  if (constraints.length > 0 || Array.isArray(payload.constraints)) data.constraints = constraints;

  const notes = toNullableString(payload.notes);
  if (notes !== undefined) data.notes = notes;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "no_allowed_fields" }, { status: 400 });
  }

  const location = await prisma.location.update({
    where: { id: params.id },
    data
  });

  return NextResponse.json({ location });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifyLocationOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  await prisma.location.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
