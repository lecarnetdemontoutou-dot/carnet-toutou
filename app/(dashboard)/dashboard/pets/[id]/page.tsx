import { notFound } from "next/navigation";
import { requireUser, assertOwnsPet } from "@/lib/permissions/guards";
import { petRepository } from "@/server/repositories/pet.repository";
import { PetForm } from "@/components/pets/pet-form";
import { LostModeSwitch } from "@/components/pets/lost-mode-switch";
import { VisibilitySettingsForm } from "@/components/pets/visibility-settings-form";
import {
  updatePetAction,
  updateVisibilitySettingsAction,
  deletePetAction,
} from "@/server/actions/pet.actions";
import { DeleteForm } from "@/components/ui/delete-form";

export default async function EditPetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const user = await requireUser();
  const pet = await petRepository.findById(id);

  if (!pet) notFound();
  assertOwnsPet(user.id, pet.userId);

  async function handleUpdate(formData: FormData) {
    "use server";
    await updatePetAction(id, formData);
  }

  async function handleVisibility(formData: FormData) {
    "use server";
    await updateVisibilitySettingsAction(id, formData);
  }

  async function handleDelete() {
    "use server";
    await deletePetAction(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-orange)]" style={{ fontFamily: "var(--font-display)" }}>
          {pet.name}
        </h1>
        {pet.tags[0]?.tagCode && (
          <a
            href={`/t/${pet.tags[0].tagCode}`}
            target="_blank"
            className="text-sm text-[var(--color-ink-soft)] underline"
          >
            Voir la page publique →
          </a>
        )}
      </div>

      {saved === "1" && (
        <div className="rounded-2xl bg-[var(--color-green)]/30 px-5 py-3 text-sm font-medium text-[var(--color-ink)]">
          ✓ Modifications enregistrées
        </div>
      )}

      <LostModeSwitch petId={pet.id} initialValue={pet.isLost} />

      <PetForm
        pet={pet}
        action={handleUpdate}
        submitLabel="Enregistrer les modifications"
      />

      {pet.publicSettings && (
        <VisibilitySettingsForm
          settings={pet.publicSettings}
          action={handleVisibility}
        />
      )}

      <div className="rounded-2xl border border-[var(--color-alert)]/30 bg-[var(--color-alert-soft)] p-5">
        <p className="font-semibold text-[var(--color-ink)]">Retirer ce chien de mon compte</p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Supprime définitivement la fiche de {pet.name} et toutes ses données.
        </p>
        <DeleteForm
          action={handleDelete}
          confirmMessage={`Retirer ${pet.name} de ton compte ? Cette action est irréversible.`}
          label={`Retirer ${pet.name}`}
        />
      </div>
    </div>
  );
}
