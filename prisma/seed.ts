import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@quillborn.ai" },
    update: {},
    create: {
      email: "demo@quillborn.ai",
      name: "Demo Author"
    }
  });

  const project = await prisma.project.upsert({
    where: { slug: "demo-project" },
    update: {},
    create: {
      ownerId: demoUser.id,
      title: "Demo Project",
      slug: "demo-project",
      description: "Seed project for local development",
      settings: { theme: "noir" }
    }
  });

  await prisma.character.upsert({
    where: { id: "demo-character" },
    update: {},
    create: {
      id: "demo-character",
      projectId: project.id,
      name: "Aria Novak",
      role: "Captain",
      bio: "A daring skyship captain with a haunted past.",
      tags: ["leader", "rogue"],
      goals: { primary: "Protect the crew" },
      flaws: ["Impulsive"],
      relationships: { mentor: "Marcus Vale" }
    }
  });

  await prisma.scene.upsert({
    where: { id: "demo-scene" },
    update: {},
    create: {
      id: "demo-scene",
      projectId: project.id,
      title: "Storm over the Shards",
      intent: "Introduce the central conflict",
      outcome: "Crew decides to seek the oracle.",
      flags: ["INTRO", "DEMO"],
      metadata: { mood: "tense" }
    }
  });

  await prisma.draft.create({
    data: {
      projectId: project.id,
      sceneId: "demo-scene",
      contentMd: "# Storm over the Shards\n\nAria tightened her grip on the wheel as lightning stitched the sky...",
      createdBy: demoUser.id,
      meta: { source: "seed" }
    }
  });

  console.log("Seeded demo user and project");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.();
  });
