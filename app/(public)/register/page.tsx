import { AuthCard } from "@/components/layout/auth-card";
import { RegisterForm } from "@/components/forms/register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <AuthCard
      title="Bienvenue"
      subtitle={code ? "Crée ton compte pour activer la médaille de ton chien." : "Crée ton compte pour gérer tes médailles."}
    >
      <RegisterForm activationCode={code} />
    </AuthCard>
  );
}
