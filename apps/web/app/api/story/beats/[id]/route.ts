import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const data = await req.json();
  const beat = await prisma.beat.update({ where: { id: params.id }, data });
  return NextResponse.json({ beat });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  await prisma.beat.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
