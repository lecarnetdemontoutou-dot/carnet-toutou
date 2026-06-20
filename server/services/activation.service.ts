import { prisma } from "@/lib/db/client";
import { tagRepository } from "@/server/repositories/tag.repository";

export type ActivationResult =
  | { success: true; petId: string }
  | { success: false; code: "NOT_FOUND" | "ALREADY_ACTIVE" | "DISABLED" | "REPLACED" };

/**
 * Active une médaille à partir de son code privé.
 *
 * Toute la logique de cas d'erreur vit ici (et pas dans les composants) :
 * - médaille inexistante
 * - déjà active
 * - désactivée / remplacée
 *
 * Le rattachement à l'utilisateur et au chien se fait dans une transaction
 * pour éviter tout état intermédiaire incohérent.
 */
export async function activateTag(params: {
  activationCode: string;
  userId: string;
  petId: string;
}): Promise<ActivationResult> {
  const tag = await tagRepository.findByActivationCode(params.activationCode);

  if (!tag) {
    return { success: false, code: "NOT_FOUND" };
  }

  if (tag.status === "ACTIVE") {
    return { success: false, code: "ALREADY_ACTIVE" };
  }

  if (tag.status === "DISABLED") {
    return { success: false, code: "DISABLED" };
  }

  if (tag.status === "REPLACED" || tag.status === "ARCHIVED") {
    return { success: false, code: "REPLACED" };
  }

  await prisma.tag.update({
    where: { id: tag.id },
    data: {
      userId: params.userId,
      petId: params.petId,
      status: "ACTIVE",
      activatedAt: new Date(),
    },
  });

  return { success: true, petId: params.petId };
}
