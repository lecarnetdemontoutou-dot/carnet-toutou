"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth/auth-client";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    const { error: authError } = await signUp.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
    } as Parameters<typeof signUp.email>[0]);

    setPending(false);
    if (authError) {
      setError(authError.message ?? "Impossible de créer le compte.");
      return;
    }
    router.push("/activate");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" name="firstName" type="text" />
        <Field label="Nom" name="lastName" type="text" />
      </div>
      <Field label="Email" name="email" type="email" />
      <Field label="Mot de passe" name="password" type="password" hint="8 caractères minimum" />
      {error && <p className="text-sm text-[var(--color-alert)]">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--color-clay)] px-5 py-3 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>
      <p className="text-center text-sm text-[var(--color-ink-soft)]">
        Déjà un compte ?{" "}
        <a href="/login" className="underline">
          Se connecter
        </a>
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  hint,
}: {
  label: string;
  name: string;
  type: string;
  hint?: string;
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
      {hint && (
        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{hint}</p>
      )}
    </div>
  );
}
