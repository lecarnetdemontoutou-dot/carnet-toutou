"use client";

import { useState } from "react";
import { AuthCard } from "@/components/layout/auth-card";
import { authClient } from "@/lib/auth/auth-client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const email = new FormData(e.currentTarget).get("email") as string;
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setPending(false);
    if (result?.error) {
      setError("Une erreur est survenue. Réessaie dans quelques instants.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="On t'envoie un lien pour le réinitialiser."
    >
      {sent ? (
        <p className="text-center text-[var(--color-ink-soft)]">
          Si un compte existe avec cet email, un lien de réinitialisation vient
          d&apos;être envoyé.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--color-ink-soft)]">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[var(--color-clay)] px-5 py-3 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? "Envoi en cours…" : "Envoyer le lien"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
