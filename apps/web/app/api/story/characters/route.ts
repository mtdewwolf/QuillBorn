import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  const characters = await prisma.character.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ characters });
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (!payload.projectId || !payload.name) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const character = await prisma.character.create({
    data: {
      projectId: payload.projectId,
      name: payload.name,
      role: payload.role,
      bio: payload.bio,
      tags: payload.tags ?? [],
      flaws: payload.flaws ?? []
    }
  });

  return NextResponse.json({ character }, { status: 201 });
}
