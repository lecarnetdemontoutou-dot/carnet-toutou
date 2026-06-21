"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions/guards";
import { tagRepository } from "@/server/repositories/tag.repository";
import { prisma } from "@/lib/db/client";
import { customAlphabet } from "nanoid";

const codeAlphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // sans 0/O/1/I, pour éviter les confusions
const tagCodeId = customAlphabet(codeAlphabet, 8);
const activationCodeId = customAlphabet(codeAlphabet, 6);

export async function disableTagAction(tagId: string) {
  await requireAdmin();
  await tagRepository.setStatus(tagId, "DISABLED");
  revalidatePath("/admin/tags");
}

export async function markTagReplacedAction(tagId: string) {
  await requireAdmin();
  await tagRepository.setStatus(tagId, "REPLACED");
  revalidatePath("/admin/tags");
}

export async function reactivateTagAction(tagId: string) {
  await requireAdmin();
  await tagRepository.setStatus(tagId, "ACTIVE");
  revalidatePath("/admin/tags");
}

export async function deleteTagAction(tagId: string) {
  await requireAdmin();
  await prisma.scanEvent.deleteMany({ where: { tagId } });
  await prisma.foundReport.deleteMany({ where: { tagId } });
  await prisma.tag.delete({ where: { id: tagId } });
  revalidatePath("/admin/tags");
}

export async function deleteTagsAction(tagIds: string[]) {
  await requireAdmin();
  await prisma.scanEvent.deleteMany({ where: { tagId: { in: tagIds } } });
  await prisma.foundReport.deleteMany({ where: { tagId: { in: tagIds } } });
  await prisma.tag.deleteMany({ where: { id: { in: tagIds } } });
  revalidatePath("/admin/tags");
}

/** Génère un lot de nouvelles médailles UNASSIGNED, prêtes à être imprimées. */
export async function createTagBatchAction(formData: FormData) {
  await requireAdmin();
  const count = Number(formData.get("count") ?? 1);

  for (let i = 0; i < Math.min(count, 100); i++) {
    await tagRepository.createUnassigned({
      tagCode: tagCodeId(),
      activationCode: `ACT-${activationCodeId()}`,
    });
  }

  revalidatePath("/admin/tags");
}
