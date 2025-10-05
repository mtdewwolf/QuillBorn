import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/helpers";

async function generateUniqueSlug(base: string) {
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) {
      return slug;
    }
    slug = base + "-" + counter;
    counter += 1;
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ projects: [] });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const title = typeof body.title === "string" ? body.title : "Untitled Project";
  const slugBase = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);
  const base = slugBase.length > 0 ? slugBase : "project";
  const slug = await generateUniqueSlug(base);

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      ownerId: user.id
    }
  });

  return NextResponse.json({ project }, { status: 201 });
}
