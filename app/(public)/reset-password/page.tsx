"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/layout/auth-card";
import { authClient } from "@/lib/auth/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setPending(false);
      return;
    }

    if (!token) {
      setError("Lien invalide ou expiré.");
      setPending(false);
      return;
    }

    const { error: authError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    setPending(false);
    if (authError) {
      setError("Lien invalide ou expiré. Refais une demande.");
      return;
    }

    router.push("/login");
  }

  return (
    <AuthCard
      title="Nouveau mot de passe"
      subtitle="Choisis un nouveau mot de passe pour ton compte."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--color-ink-soft)]">
            Nouveau mot de passe
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-ink-soft)]">
            Confirmer le mot de passe
          </label>
          <input
            name="confirm"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
          />
        </div>
        {error && <p className="text-sm text-[var(--color-alert)]">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[var(--color-clay)] px-5 py-3 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : "Enregistrer le mot de passe"}
        </button>
      </form>
    </AuthCard>
  );
}
