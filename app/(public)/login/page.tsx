import { AuthCard } from "@/components/layout/auth-card";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <AuthCard
      title="Bon retour"
      subtitle="Connecte-toi pour gérer tes médailles."
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
