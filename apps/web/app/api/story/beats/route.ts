import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  const beats = await prisma.beat.findMany({
    where: { projectId },
    orderBy: { order: "asc" }
  });

  return NextResponse.json({ beats });
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (!payload.projectId || !payload.label) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const beat = await prisma.beat.create({
    data: {
      projectId: payload.projectId,
      label: payload.label,
      act: payload.act ?? 1,
      seq: payload.seq ?? 1,
      order: payload.order ?? 1,
      synopsis: payload.synopsis,
      targets: payload.targets ?? []
    }
  });

  return NextResponse.json({ beat }, { status: 201 });
}
