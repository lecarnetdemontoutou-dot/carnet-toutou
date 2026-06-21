"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, assertOwnsPet } from "@/lib/permissions/guards";
import { petFormSchema } from "@/lib/validators/schemas";
import { petRepository } from "@/server/repositories/pet.repository";
import { prisma } from "@/lib/db/client";

function readPetFormData(formData: FormData) {
  return petFormSchema.parse({
    name: formData.get("name"),
    breed: formData.get("breed") || undefined,
    birthDate: formData.get("birthDate") || undefined,
    sex: formData.get("sex") || "UNKNOWN",
    weightKg: formData.get("weightKg") || undefined,
    photoUrl: formData.get("photoUrl") || undefined,
    description: formData.get("description") || undefined,
    publicMessage: formData.get("publicMessage") || undefined,
    emergencyPhone: formData.get("emergencyPhone") || undefined,
    secondaryPhone: formData.get("secondaryPhone") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    address: formData.get("address") || undefined,
    vetName: formData.get("vetName") || undefined,
    vetPhone: formData.get("vetPhone") || undefined,
    medicalNotes: formData.get("medicalNotes") || undefined,
    behaviorNotes: formData.get("behaviorNotes") || undefined,
    distinctiveFeatures: formData.get("distinctiveFeatures") || undefined,
    emergencyInstructions: formData.get("emergencyInstructions") || undefined,
  });
}

export async function createPetAction(formData: FormData) {
  const user = await requireUser();
  const data = readPetFormData(formData);

  const pet = await petRepository.create(user.id, {
    ...data,
    birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
  });

  revalidatePath("/dashboard/pets");
  redirect(`/dashboard/pets/${pet.id}`);
}

export async function updatePetAction(petId: string, formData: FormData) {
  const user = await requireUser();
  const pet = await petRepository.findById(petId);
  if (!pet) throw new Error("NOT_FOUND");
  assertOwnsPet(user.id, pet.userId);

  const data = readPetFormData(formData);

  // Sécurité : si le formulaire ne renvoie pas de photoUrl (champ vide ou non soumis),
  // on conserve la photo existante en base plutôt que de l'effacer.
  const photoUrl = data.photoUrl ?? pet.photoUrl ?? undefined;

  await petRepository.update(petId, {
    ...data,
    photoUrl,
    birthDate: data.birthDate ? new Date(data.birthDate) : null,
  });

  revalidatePath(`/dashboard/pets/${petId}`);
  redirect(`/dashboard/pets/${petId}?saved=1`);
}

export async function setLostStatusAction(petId: string, isLost: boolean) {
  const user = await requireUser();
  const pet = await petRepository.findById(petId);
  if (!pet) throw new Error("NOT_FOUND");
  assertOwnsPet(user.id, pet.userId);

  await petRepository.setLostStatus(petId, isLost);
  revalidatePath(`/dashboard/pets/${petId}`);
}

export async function deletePetAction(petId: string) {
  const user = await requireUser();
  const pet = await petRepository.findById(petId);
  if (!pet) throw new Error("NOT_FOUND");
  assertOwnsPet(user.id, pet.userId);

  await prisma.pet.delete({ where: { id: petId } });
  revalidatePath("/dashboard/pets");
  redirect("/dashboard/pets");
}
