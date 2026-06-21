import { AuthCard } from "@/components/layout/auth-card";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Bon retour"
      subtitle="Connecte-toi pour gérer tes médailles."
    >
      <LoginForm />
    </AuthCard>
  );
}
