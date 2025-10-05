import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/helpers";
import { requireFeature, type PlanId } from "@/lib/billing/plans";
import { composeSceneContext } from "@/lib/context/composeScene";
import { generateSceneDraft } from "@/lib/llm/openrouter";
import { prisma } from "@/lib/prisma";
import { verifyProjectOwnership, verifySceneOwnership } from "@/lib/projects/ownership";

export async function POST(request: Request) {
  const payload = await request.json();
  const sceneId: string | undefined = payload.sceneId;
  const projectId: string | undefined = payload.projectId;

  if (typeof sceneId !== "string" || typeof projectId !== "string") {
    return NextResponse.json({ error: "sceneId and projectId required" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const projectOwnership = await verifyProjectOwnership(projectId, user.id);
  if (!projectOwnership.ok) {
    return NextResponse.json({ error: projectOwnership.error }, { status: projectOwnership.status });
  }

  const sceneOwnership = await verifySceneOwnership(sceneId, user.id);
  if (!sceneOwnership.ok) {
    return NextResponse.json({ error: sceneOwnership.error }, { status: sceneOwnership.status });
  }

  if (sceneOwnership.record.projectId !== projectId) {
    return NextResponse.json({ error: "scene_mismatch" }, { status: 400 });
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
