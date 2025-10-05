import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/supabase-server";

export async function getCurrentUser() {
  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) return null;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: session?.user?.user_metadata?.full_name ?? session?.user?.email ?? "Author",
      },
    });
  }

  return user;
}
