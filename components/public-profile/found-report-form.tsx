"use client";

import { useActionState, useState } from "react";
import {
  submitFoundReportAction,
  type FoundReportFormState,
} from "@/server/actions/public-scan.actions";

const initialState: FoundReportFormState = { status: "idle" };

export function FoundReportForm({ tagCode }: { tagCode: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitFoundReportAction,
    initialState
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl bg-[var(--color-card)] p-5 text-center">
        <p className="font-semibold text-[var(--color-ink)]">
          Merci infiniment 🐾
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Le propriétaire va recevoir votre message. Restez si possible avec
          le chien en attendant.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-full border-2 border-[var(--color-ink)]/15 bg-white/60 px-5 py-3.5 text-center font-semibold text-[var(--color-ink)] transition active:scale-[0.98]"
      >
        J&apos;ai trouvé ce chien
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl bg-[var(--color-card)] p-4 space-y-3"
    >
      <input type="hidden" name="tagCode" value={tagCode} />
      {/* Honeypot anti-spam : un vrai humain ne remplit jamais ce champ */}
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label className="text-sm font-medium text-[var(--color-ink-soft)]">
          Votre prénom
        </label>
        <input
          name="finderName"
          required
          className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--color-ink-soft)]">
          Votre téléphone
        </label>
        <input
          name="finderPhone"
          type="tel"
          required
          className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--color-ink-soft)]">
          Où l&apos;avez-vous trouvé ? (facultatif)
        </label>
        <input
          name="locationText"
          className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-[var(--color-alert)]">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--color-ink)] px-5 py-3 font-semibold text-[var(--color-sand)] transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Envoyer au propriétaire"}
      </button>
    </form>
  );
}
