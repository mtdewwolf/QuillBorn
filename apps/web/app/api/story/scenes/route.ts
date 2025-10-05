import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
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
  if (!payload.projectId || !payload.title) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const scene = await prisma.scene.create({
    data: {
      projectId: payload.projectId,
      title: payload.title,
      intent: payload.intent,
      outcome: payload.outcome,
      flags: payload.flags ?? []
    }
  });

  return NextResponse.json({ scene }, { status: 201 });
}
