import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { verifyProjectOwnership } from "@/lib/projects/ownership";

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

  const beats = await prisma.beat.findMany({
    where: { projectId },
    orderBy: { order: "asc" }
  });

  return NextResponse.json({ beats });
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (typeof payload.projectId !== "string" || typeof payload.label !== "string") {
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

  const label = payload.label.trim();
  if (label.length === 0) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const beat = await prisma.beat.create({
    data: {
      projectId: payload.projectId,
      label,
      act: toNumber(payload.act) ?? 1,
      seq: toNumber(payload.seq) ?? 1,
      order: toNumber(payload.order) ?? 1,
      synopsis: typeof payload.synopsis === "string" ? payload.synopsis : undefined,
      targets: toStringArray(payload.targets)
    }
  });

  return NextResponse.json({ beat }, { status: 201 });
}
