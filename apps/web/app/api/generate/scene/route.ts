import { NextResponse } from "next/server";

import { requireFeature, type PlanId } from "@/lib/billing/plans";
import { composeSceneContext } from "@/lib/context/composeScene";
import { generateSceneDraft } from "@/lib/llm/openrouter";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json();
  const sceneId: string | undefined = payload.sceneId;
  const projectId: string | undefined = payload.projectId;

  if (!sceneId || !projectId) {
    return NextResponse.json({ error: "sceneId and projectId required" }, { status: 400 });
  }

  const subscription = await prisma.subscription.findFirst({ where: { projectId } });
  const planId = (subscription?.plan ?? "FREE") as PlanId;
  const requiredFeature = process.env.OPENROUTER_API_KEY ? "live-llm" : "mock";

  try {
    requireFeature(planId, requiredFeature);
  } catch (error) {
    return NextResponse.json({ error: "upgrade_required" }, { status: 402 });
  }

  const contextPack = await composeSceneContext(sceneId);
  if (!contextPack) {
    return NextResponse.json({ error: "scene_not_found" }, { status: 404 });
  }

  const content = await generateSceneDraft(contextPack);

  await prisma.run.create({
    data: {
      projectId,
      target: "SCENE",
      targetId: sceneId,
      contextPack,
      inputs: payload,
      outputDraft: content,
      status: "OK"
    }
  });

  return NextResponse.json({ draft: content });
}
