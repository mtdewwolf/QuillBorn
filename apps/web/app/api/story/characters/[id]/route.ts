import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const character = await prisma.character.findUnique({ where: { id: params.id } });
  if (!character) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ character });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const data = await req.json();
  const character = await prisma.character.update({
    where: { id: params.id },
    data
  });
  return NextResponse.json({ character });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  await prisma.character.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
