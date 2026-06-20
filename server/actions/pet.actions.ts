"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, assertOwnsPet } from "@/lib/permissions/guards";
import { petFormSchema, publicProfileSettingsSchema } from "@/lib/validators/schemas";
import { petRepository } from "@/server/repositories/pet.repository";
import { prisma } from "@/lib/db/client";

function readPetFormData(formData: FormData) {
  return petFormSchema.parse({
    name: formData.get("name"),
    breed: formData.get("breed") || undefined,
    birthDate: formData.get("birthDate") || undefined,
    sex: formData.get("sex") || "UNKNOWN",
    weightKg: formData.get("weightKg") || undefined,
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

  await petRepository.update(petId, {
    ...data,
    birthDate: data.birthDate ? new Date(data.birthDate) : null,
  });

  revalidatePath(`/dashboard/pets/${petId}`);
}

export async function setLostStatusAction(petId: string, isLost: boolean) {
  const user = await requireUser();
  const pet = await petRepository.findById(petId);
  if (!pet) throw new Error("NOT_FOUND");
  assertOwnsPet(user.id, pet.userId);

  await petRepository.setLostStatus(petId, isLost);
  revalidatePath(`/dashboard/pets/${petId}`);
}

export async function updateVisibilitySettingsAction(
  petId: string,
  formData: FormData
) {
  const user = await requireUser();
  const pet = await petRepository.findById(petId);
  if (!pet) throw new Error("NOT_FOUND");
  assertOwnsPet(user.id, pet.userId);

  const data = publicProfileSettingsSchema.parse({
    showEmergencyPhone: formData.get("showEmergencyPhone") === "on",
    showSecondaryPhone: formData.get("showSecondaryPhone") === "on",
    showEmail: formData.get("showEmail") === "on",
    showAddress: formData.get("showAddress") === "on",
    showMedicalNotes: formData.get("showMedicalNotes") === "on",
    showBehaviorNotes: formData.get("showBehaviorNotes") === "on",
    showVetInfo: formData.get("showVetInfo") === "on",
    showLostStatus: formData.get("showLostStatus") === "on",
  });

  await prisma.publicProfileSettings.update({
    where: { petId },
    data,
  });

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
