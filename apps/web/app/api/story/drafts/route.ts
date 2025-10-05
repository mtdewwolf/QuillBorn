import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json();
  const user = await getCurrentUser();

  if (!payload.projectId || !payload.content) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  let authorId = user?.id;
  if (!authorId) {
    const demoAuthor = await prisma.user.findFirst({ where: { email: "demo@quillborn.ai" } });
    authorId = demoAuthor?.id ?? "demo-user";
  }

  const draft = await prisma.draft.create({
    data: {
      projectId: payload.projectId,
      sceneId: payload.sceneId ?? undefined,
      contentMd: payload.content,
      createdBy: authorId
    }
  });

  return NextResponse.json({ draft }, { status: 201 });
}
