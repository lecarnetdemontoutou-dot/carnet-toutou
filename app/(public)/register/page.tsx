import { AuthCard } from "@/components/layout/auth-card";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Bienvenue"
      subtitle="Crée ton compte pour activer la médaille de ton chien."
    >
      <RegisterForm />
    </AuthCard>
  );
}
