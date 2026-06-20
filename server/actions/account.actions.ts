"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/permissions/guards";
import { prisma } from "@/lib/db/client";

export async function updateAccountAction(formData: FormData) {
  const user = await requireUser();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: formData.get("firstName")?.toString().trim() || undefined,
      lastName: formData.get("lastName")?.toString().trim() || undefined,
      phone: formData.get("phone")?.toString().trim() || undefined,
    },
  });

  revalidatePath("/dashboard/settings");
}
