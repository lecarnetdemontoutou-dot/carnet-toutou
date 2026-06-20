import { redirect } from "next/navigation";
import { getSession } from "@/lib/permissions/guards";
import { petRepository } from "@/server/repositories/pet.repository";
import { AuthCard } from "@/components/layout/auth-card";
import { ActivateForm } from "@/components/forms/activate-form";

export default async function ActivatePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?redirectTo=/activate");
  }

  const pets = await petRepository.findManyByUser(session.user.id);

  return (
    <AuthCard
      title="Activer ta médaille"
      subtitle="Indique le code fourni avec ta médaille pour la relier à ton chien."
    >
      <ActivateForm existingPets={pets.map((p) => ({ id: p.id, name: p.name }))} />
    </AuthCard>
  );
}
