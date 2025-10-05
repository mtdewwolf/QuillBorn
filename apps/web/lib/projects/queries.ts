import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/helpers";

export async function getProjectsForUser() {
  const user = await getCurrentUser();
  if (!user) return [];

  return prisma.project.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" }
  });
}
