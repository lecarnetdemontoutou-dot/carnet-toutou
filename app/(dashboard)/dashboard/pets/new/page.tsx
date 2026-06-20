import { PetForm } from "@/components/pets/pet-form";
import { createPetAction } from "@/server/actions/pet.actions";

export default function NewPetPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-orange)]" style={{ fontFamily: "var(--font-display)" }}>
        Nouveau chien
      </h1>
      <PetForm action={createPetAction} submitLabel="Créer la fiche" />
    </div>
  );
}
