"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  activateTagAction,
  type ActivateTagFormState,
} from "@/server/actions/activation.actions";

const initialState: ActivateTagFormState = { status: "idle" };

type ExistingPet = { id: string; name: string };

export function ActivateForm({ existingPets }: { existingPets: ExistingPet[] }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    activateTagAction,
    initialState
  );

  if (state.status === "success") {
    router.push("/activate/success");
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-[var(--color-ink-soft)]">
          Code d&apos;activation
        </label>
        <input
          name="activationCode"
          required
          placeholder="ACT-9XK7PQ"
          className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 uppercase tracking-wide text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
        />
        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
          Ce code se trouve sur la carte fournie avec ta médaille.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--color-ink-soft)]">
          Pour quel chien ?
        </label>

        {existingPets.length > 0 && (
          <select
            name="petId"
            className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
          >
            <option value="">+ Créer un nouveau chien</option>
            {existingPets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        )}

        <input
          name="petName"
          placeholder="Prénom du chien (si nouveau)"
          className="mt-2 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-[var(--color-alert)]">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--color-clay)] px-5 py-3.5 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Activation…" : "Activer ma médaille"}
      </button>
    </form>
  );
}
