"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerClient } from "@/lib/auth/supabase-server";
import { prisma } from "@/lib/prisma";

export async function createProjectAction(formData: FormData) {
  const title = String(formData.get("title") ?? "Untitled Project");
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("Must be signed in");
  }

  const owner = await prisma.user.upsert({
    where: { email: user.email },
    update: {},
    create: { email: user.email, name: user.user_metadata?.full_name },
  });

  const slugBase = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);

  let slug = slugBase.length > 0 ? slugBase : "project-" + Date.now();
  let counter = 1;
  // ensure slug uniqueness
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) break;
    slug = (slugBase.length > 0 ? slugBase : "project") + "-" + counter;
    counter += 1;
  }

  await prisma.project.create({
    data: {
      title,
      slug,
      ownerId: owner.id,
    },
  });

  revalidatePath("/app");
}
