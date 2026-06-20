"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/permissions/guards";
import { prisma } from "@/lib/db/client";

export async function adminDeleteUserAction(userId: string) {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    throw new Error("Tu ne peux pas supprimer ton propre compte depuis l'admin.");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
