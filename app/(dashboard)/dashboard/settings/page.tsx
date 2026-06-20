import { requireUser } from "@/lib/permissions/guards";
import { updateAccountAction, deleteAccountAction } from "@/server/actions/account.actions";
import { SignOutButton } from "@/components/forms/sign-out-button";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const user = await requireUser();

  async function handleDelete() {
    "use server";
    await deleteAccountAction();
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-orange)]" style={{ fontFamily: "var(--font-display)" }}>
        Réglages du compte
      </h1>

      {saved === "1" && (
        <div className="rounded-2xl bg-[var(--color-green)]/30 px-5 py-3 text-sm font-medium text-[var(--color-ink)]">
          ✓ Modifications enregistrées
        </div>
      )}

      <form action={updateAccountAction} className="space-y-4 rounded-2xl bg-white/70 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-[var(--color-ink-soft)]">Prénom</label>
            <input
              name="firstName"
              defaultValue={user.firstName ?? ""}
              className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-clay)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--color-ink-soft)]">Nom</label>
            <input
              name="lastName"
              defaultValue={user.lastName ?? ""}
              className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-clay)]"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-ink-soft)]">Téléphone</label>
          <input
            name="phone"
            defaultValue={user.phone ?? ""}
            className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-clay)]"
          />
        </div>
        <p className="text-sm text-[var(--color-ink-soft)]">Email : {user.email}</p>
        <SubmitButton
          label="Enregistrer"
          className="rounded-full bg-[var(--color-clay)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        />
      </form>

      <SignOutButton />

      <form
        action={handleDelete}
        onSubmit={(e) => {
          if (!confirm("Supprimer définitivement ton compte et toutes tes données ? Cette action est irréversible.")) {
            e.preventDefault();
          }
        }}
        className="rounded-2xl border border-[var(--color-alert)]/30 bg-[var(--color-alert-soft)] p-5"
      >
        <p className="font-semibold text-[var(--color-ink)]">Supprimer mon compte</p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Toutes tes données (chiens, médailles, historique de scans) seront effacées définitivement.
          Conformément au RGPD, tu peux exercer ce droit à tout moment.
        </p>
        <button
          type="submit"
          className="mt-4 rounded-full bg-[var(--color-alert)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Supprimer mon compte
        </button>
      </form>

      <p className="text-center text-xs text-[var(--color-ink-soft)]">
        <a href="/confidentialite" className="underline">Politique de confidentialité</a>
        {" · "}
        <a href="/mentions-legales" className="underline">Mentions légales</a>
      </p>
    </div>
  );
}
