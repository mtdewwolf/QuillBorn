import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  const locations = await prisma.location.findMany({
    where: { projectId },
    orderBy: { name: "asc" }
  });

  return NextResponse.json({ locations });
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (!payload.projectId || !payload.name) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const location = await prisma.location.create({
    data: {
      projectId: payload.projectId,
      name: payload.name,
      sensory: payload.sensory ?? [],
      constraints: payload.constraints ?? [],
      notes: payload.notes
    }
  });

  return NextResponse.json({ location }, { status: 201 });
}
