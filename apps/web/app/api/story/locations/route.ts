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

function toNullableString(value: unknown) {
  if (value === null) {
    return null;
  }
  return typeof value === "string" ? value : undefined;
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

  const locations = await prisma.location.findMany({
    where: { projectId },
    orderBy: { name: "asc" }
  });

  return NextResponse.json({ locations });
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

  const location = await prisma.location.create({
    data: {
      projectId: payload.projectId,
      name,
      sensory: toStringArray(payload.sensory),
      constraints: toStringArray(payload.constraints),
      notes: toNullableString(payload.notes)
    }
  });

  return NextResponse.json({ location }, { status: 201 });
}
