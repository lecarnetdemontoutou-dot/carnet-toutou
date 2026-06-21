"use client";

import { useTransition } from "react";
import {
  disableTagAction,
  markTagReplacedAction,
  reactivateTagAction,
  resetTagAction,
  deleteTagAction,
} from "@/server/actions/admin-tag.actions";

export function TagAdminActions({ tagId, status }: { tagId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {status !== "DISABLED" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => disableTagAction(tagId))}
          className="rounded-full border border-[var(--color-ring)] px-3 py-1 text-xs font-medium text-[var(--color-ink-soft)] disabled:opacity-50"
        >
          Désactiver
        </button>
      )}
      {status === "ACTIVE" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => markTagReplacedAction(tagId))}
          className="rounded-full border border-[var(--color-ring)] px-3 py-1 text-xs font-medium text-[var(--color-ink-soft)] disabled:opacity-50"
        >
          Marquer remplacée
        </button>
      )}
      {status === "DISABLED" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => reactivateTagAction(tagId))}
          className="rounded-full bg-[var(--color-sage)] px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
        >
          Réactiver
        </button>
      )}
      {status === "ACTIVE" && (
        <button
          disabled={pending}
          onClick={() => {
            if (confirm("Réinitialiser cette médaille ? Elle sera désassignée du chien et pourra être réactivée.")) {
              startTransition(() => resetTagAction(tagId));
            }
          }}
          className="rounded-full border border-orange-200 px-3 py-1 text-xs font-medium text-orange-500 hover:bg-orange-50 disabled:opacity-50"
        >
          Réinitialiser
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Supprimer définitivement cette médaille ?")) {
            startTransition(() => deleteTagAction(tagId));
          }
        }}
        className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}
