import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const data = await req.json();
  const scene = await prisma.scene.update({
    where: { id: params.id },
    data
  });
  return NextResponse.json({ scene });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  await prisma.scene.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
