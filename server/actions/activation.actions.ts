"use server";

import { activationSchema } from "@/lib/validators/schemas";
import { requireUser } from "@/lib/permissions/guards";
import { activateTag } from "@/server/services/activation.service";
import { petRepository } from "@/server/repositories/pet.repository";
import { revalidatePath } from "next/cache";

export type ActivateTagFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  petId?: string;
};

/**
 * Active une médaille pour le chien sélectionné (existant ou nouvellement créé).
 * Appelée depuis le formulaire de /activate.
 */
export async function activateTagAction(
  _prev: ActivateTagFormState,
  formData: FormData
): Promise<ActivateTagFormState> {
  const user = await requireUser();

  const parsed = activationSchema.safeParse({
    activationCode: formData.get("activationCode"),
    petId: formData.get("petId") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const petId = parsed.data.petId;
  const petName = formData.get("petName")?.toString().trim();

  if (!petId && !petName) {
    return {
      status: "error",
      message: "Indique le prénom de ton chien, ou choisis un chien existant.",
    };
  }

  // On valide le code d'activation AVANT de créer un éventuel nouveau chien
  // pour éviter de laisser des fiches orphelines en cas de code invalide.
  const { tagRepository: tr } = await import("@/server/repositories/tag.repository");
  const tag = await tr.findByActivationCode(parsed.data.activationCode);
  if (!tag) {
    return { status: "error", message: "Ce code d'activation n'existe pas. Vérifie la saisie." };
  }
  if (tag.status !== "UNASSIGNED") {
    const messages: Record<string, string> = {
      ACTIVE: "Cette médaille est déjà activée sur un compte.",
      DISABLED: "Cette médaille a été désactivée. Contacte le support.",
      REPLACED: "Cette médaille a été remplacée et n'est plus valide.",
      ARCHIVED: "Cette médaille a été remplacée et n'est plus valide.",
    };
    return { status: "error", message: messages[tag.status] ?? "Code invalide." };
  }

  // Code valide → on peut créer le chien si nécessaire
  const resolvedPetId = petId ?? (await petRepository.create(user.id, { name: petName! })).id;

  const result = await activateTag({
    activationCode: parsed.data.activationCode,
    userId: user.id,
    petId: resolvedPetId,
  });

  if (!result.success) {
    return { status: "error", message: "Une erreur inattendue est survenue. Contacte le support." };
  }

  revalidatePath("/dashboard/tags");
  return { status: "success", petId: result.petId };
}
