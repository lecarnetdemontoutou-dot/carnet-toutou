"use client";

import { useState } from "react";
import { sendLocationAction } from "@/server/actions/location.actions";

type State = "idle" | "loading" | "sent" | "error" | "denied";

export function LocationButton({ petName, phone }: { petName: string; phone: string }) {
  const [state, setState] = useState<State>("idle");

  async function handleClick() {
    if (!navigator.geolocation) {
      setState("error");
      return;
    }

    setState("loading");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await sendLocationAction({
            petName,
            phone,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setState("sent");
        } catch {
          setState("error");
        }
      },
      () => setState("denied"),
      { timeout: 10000 }
    );
  }

  if (state === "sent") {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3.5 font-bold text-white">
        ✅ Localisation envoyée au propriétaire
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="w-full rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
        Autorise l'accès à ta position dans les réglages de ton navigateur puis réessaie.
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="w-full rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
        Une erreur est survenue. Appelle directement le propriétaire.
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[var(--color-orange)] px-5 py-3.5 font-bold text-[var(--color-orange)] transition hover:bg-orange-50 active:scale-[0.98] disabled:opacity-60"
    >
      {state === "loading" ? "Localisation en cours…" : "📍 Partager ma localisation"}
    </button>
  );
}
