import { PetForm } from "@/components/pets/pet-form";
import { createPetAction } from "@/server/actions/pet.actions";

export default function NewPetPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold italic">
        Nouveau chien
      </h1>
      <PetForm action={createPetAction} submitLabel="Créer la fiche" />
    </div>
  );
}
