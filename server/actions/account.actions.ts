"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/permissions/guards";
import { prisma } from "@/lib/db/client";

export async function updateAccountAction(formData: FormData) {
  const user = await requireUser();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: formData.get("firstName")?.toString().trim() || undefined,
      lastName: formData.get("lastName")?.toString().trim() || undefined,
      // Permet de vider le champ téléphone (null = effacé, undefined = inchangé)
      phone: formData.get("phone")?.toString().trim() || null,
    },
  });

  revalidatePath("/dashboard/settings");
}

export async function deleteAccountAction() {
  const user = await requireUser();

  // Supprime l'utilisateur en cascade (sessions, pets, tags, scan events via Prisma/PG)
  await prisma.user.delete({ where: { id: user.id } });

  redirect("/");
}
