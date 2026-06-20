"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const { error: authError } = await signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    setPending(false);
    if (authError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Email" name="email" type="email" />
      <Field label="Mot de passe" name="password" type="password" />
      {error && <p className="text-sm text-[var(--color-alert)]">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--color-clay)] px-5 py-3 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
      <div className="flex justify-between text-sm">
        <a href="/register" className="text-[var(--color-ink-soft)] underline">
          Créer un compte
        </a>
        <a href="/forgot-password" className="text-[var(--color-ink-soft)] underline">
          Mot de passe oublié ?
        </a>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-ink-soft)]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required
        className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
      />
    </div>
  );
}
