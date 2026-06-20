import type { PublicProfileSettings } from "@prisma/client";

type VisibilityKey =
  | "showEmergencyPhone"
  | "showSecondaryPhone"
  | "showEmail"
  | "showAddress"
  | "showMedicalNotes"
  | "showBehaviorNotes"
  | "showVetInfo"
  | "showLostStatus";

const OPTIONS: { key: VisibilityKey; label: string }[] = [
  { key: "showEmergencyPhone", label: "Téléphone principal" },
  { key: "showSecondaryPhone", label: "Téléphone secondaire" },
  { key: "showEmail", label: "Email de contact" },
  { key: "showAddress", label: "Adresse" },
  { key: "showMedicalNotes", label: "Notes médicales" },
  { key: "showBehaviorNotes", label: "Notes comportementales" },
  { key: "showVetInfo", label: "Informations vétérinaire" },
  { key: "showLostStatus", label: "Statut \"chien perdu\"" },
];

export function VisibilitySettingsForm({
  settings,
  action,
}: {
  settings: PublicProfileSettings;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="rounded-2xl bg-white/70 p-5">
      <h2 className="mb-1 font-semibold text-[var(--color-ink)]">
        Visible publiquement sur la page de scan
      </h2>
      <p className="mb-4 text-sm text-[var(--color-ink-soft)]">
        Choisis les informations que les personnes qui scannent la médaille
        peuvent voir.
      </p>
      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <label key={opt.key} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name={opt.key}
              defaultChecked={Boolean(settings[opt.key])}
              className="h-4 w-4 accent-[var(--color-clay)]"
            />
            {opt.label}
          </label>
        ))}
      </div>
      <button
        type="submit"
        className="mt-4 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sand)]"
      >
        Enregistrer les réglages
      </button>
    </form>
  );
}
