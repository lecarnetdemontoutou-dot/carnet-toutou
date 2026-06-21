import { redirect } from "next/navigation";
import { getSession } from "@/lib/permissions/guards";
import { petRepository } from "@/server/repositories/pet.repository";
import { AuthCard } from "@/components/layout/auth-card";
import { ActivateForm } from "@/components/forms/activate-form";

export default async function ActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const session = await getSession();

  if (!session?.user) {
    const redirectTo = code ? `/activate?code=${code}` : "/activate";
    redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const pets = await petRepository.findManyByUser(session.user.id);

  return (
    <AuthCard
      title="Active ta médaille"
      subtitle="Indique le code fourni avec ta médaille pour l'activer. Indique également le prénom de ton chien pour l'associer à la médaille."
      logoHref="/dashboard"
    >
      <ActivateForm
        existingPets={pets.map((p) => ({ id: p.id, name: p.name }))}
        prefillCode={code}
      />
    </AuthCard>
  );
}
