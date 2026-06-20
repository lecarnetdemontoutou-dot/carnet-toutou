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

  // Si aucun chien existant n'est sélectionné, on en crée un minimal à partir du prénom fourni
  async function resolvePetId(): Promise<string | null> {
    if (petId) return petId;
    const name = formData.get("petName")?.toString().trim();
    if (!name) return null;
    const pet = await petRepository.create(user.id, { name });
    return pet.id;
  }

  const resolvedPetId = await resolvePetId();
  if (!resolvedPetId) {
    return {
      status: "error",
      message: "Indique le prénom de ton chien, ou choisis un chien existant.",
    };
  }

  const result = await activateTag({
    activationCode: parsed.data.activationCode,
    userId: user.id,
    petId: resolvedPetId,
  });

  if (!result.success) {
    const messages: Record<string, string> = {
      NOT_FOUND: "Ce code d'activation n'existe pas. Vérifie la saisie.",
      ALREADY_ACTIVE: "Cette médaille est déjà activée sur un compte.",
      DISABLED: "Cette médaille a été désactivée. Contacte le support.",
      REPLACED: "Cette médaille a été remplacée et n'est plus valide.",
    };
    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/dashboard/tags");
  return { status: "success", petId: result.petId };
}
