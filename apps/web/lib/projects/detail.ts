import { prisma } from "@/lib/prisma";

export async function getProjectDetail(projectId: string, ownerId?: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      ...(ownerId ? { ownerId } : {})
    },
    include: {
      characters: true,
      scenes: {
        include: { drafts: { take: 5, orderBy: { createdAt: "desc" } } },
        orderBy: { createdAt: "desc" }
      },
      drafts: {
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  });
}
