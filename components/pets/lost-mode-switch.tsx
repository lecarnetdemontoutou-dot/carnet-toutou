"use client";

import { useState, useTransition } from "react";
import { setLostStatusAction } from "@/server/actions/pet.actions";

export function LostModeSwitch({ petId, initialValue }: { petId: string; initialValue: boolean }) {
  const [isLost, setIsLost] = useState(initialValue);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !isLost;
    setIsLost(next);
    startTransition(async () => {
      try {
        await setLostStatusAction(petId, next);
      } catch {
        setIsLost(!next); // rollback si erreur serveur
      }
    });
  }

  return (
    <div
      className={`flex items-center justify-between rounded-2xl p-5 ${
        isLost ? "bg-[var(--color-alert-soft)]" : "bg-white/70"
      }`}
    >
      <div>
        <p className="font-semibold text-[var(--color-ink)]">
          {isLost ? "🚨 Mon chien est porté disparu" : "Mode chien perdu"}
        </p>
        <p className="text-sm text-[var(--color-ink-soft)]">
          {isLost
            ? "La page publique affiche une alerte visible immédiatement."
            : "Active en un clic si ton chien s'est échappé."}
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={pending}
        aria-pressed={isLost}
        className={`relative h-8 w-14 flex-shrink-0 rounded-full transition ${
          isLost ? "bg-[var(--color-alert)]" : "bg-[var(--color-ring)]"
        } disabled:opacity-60`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
            isLost ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
