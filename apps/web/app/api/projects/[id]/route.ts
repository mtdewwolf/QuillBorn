import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/helpers";

interface RouteContext {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: { id: params.id, ownerId: user.id },
    include: { characters: true, scenes: true }
  });

  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const updates = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof updates.title === "string") data.title = updates.title;
  if (updates.description !== undefined) data.description = updates.description;
  if (updates.settings !== undefined) data.settings = updates.settings;

  const project = await prisma.project.update({
    where: { id: params.id },
    data
  });
  return NextResponse.json({ project });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const result = await prisma.project.deleteMany({ where: { id: params.id, ownerId: user.id } });
  if (result.count === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
