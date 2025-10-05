import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { verifyBeatOwnership } from "@/lib/projects/ownership";

interface RouteContext {
  params: { id: string };
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
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

  const ownership = await verifyBeatOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const payload = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof payload.label === "string") {
    const label = payload.label.trim();
    if (label.length > 0) {
      data.label = label;
    }
  }

  const act = toNumber(payload.act);
  if (act !== undefined) data.act = act;

  const seq = toNumber(payload.seq);
  if (seq !== undefined) data.seq = seq;

  const order = toNumber(payload.order);
  if (order !== undefined) data.order = order;

  const synopsis = toNullableString(payload.synopsis);
  if (synopsis !== undefined) data.synopsis = synopsis;

  const targets = toStringArray(payload.targets);
  if (targets.length > 0 || Array.isArray(payload.targets)) data.targets = targets;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "no_allowed_fields" }, { status: 400 });
  }

  const beat = await prisma.beat.update({
    where: { id: params.id },
    data
  });

  return NextResponse.json({ beat });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownership = await verifyBeatOwnership(params.id, user.id);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  await prisma.beat.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
