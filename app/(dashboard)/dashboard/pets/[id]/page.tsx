import { notFound } from "next/navigation";
import { requireUser, assertOwnsPet } from "@/lib/permissions/guards";
import { petRepository } from "@/server/repositories/pet.repository";
import { PetForm } from "@/components/pets/pet-form";
import { LostModeSwitch } from "@/components/pets/lost-mode-switch";
import { VisibilitySettingsForm } from "@/components/pets/visibility-settings-form";
import {
  updatePetAction,
  updateVisibilitySettingsAction,
} from "@/server/actions/pet.actions";

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const pet = await petRepository.findById(id);

  if (!pet) notFound();
  assertOwnsPet(user.id, pet.userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold italic">
          {pet.name}
        </h1>
        <a
          href={`/t/${pet.tags[0]?.tagCode ?? ""}`}
          target="_blank"
          className="text-sm text-[var(--color-ink-soft)] underline"
        >
          Voir la page publique →
        </a>
      </div>

      <LostModeSwitch petId={pet.id} initialValue={pet.isLost} />

      <PetForm
        pet={pet}
        action={updatePetAction.bind(null, pet.id)}
        submitLabel="Enregistrer les modifications"
      />

      {pet.publicSettings && (
        <VisibilitySettingsForm
          settings={pet.publicSettings}
          action={updateVisibilitySettingsAction.bind(null, pet.id)}
        />
      )}
    </div>
  );
}
