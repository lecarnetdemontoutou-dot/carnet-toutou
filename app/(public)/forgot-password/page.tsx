"use client";

import { useState } from "react";
import { AuthCard } from "@/components/layout/auth-card";
import { authClient } from "@/lib/auth/auth-client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    await authClient.requestPasswordReset({
      email,
      redirectTo: "/login",
    });
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
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--color-clay)] px-5 py-3 font-semibold text-white transition active:scale-[0.98]"
          >
            Envoyer le lien
          </button>
        </form>
      )}
    </AuthCard>
  );
}
