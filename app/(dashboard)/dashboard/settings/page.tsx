import { requireUser } from "@/lib/permissions/guards";
import { updateAccountAction } from "@/server/actions/account.actions";
import { SignOutButton } from "@/components/forms/sign-out-button";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="max-w-md space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold italic">
        Réglages du compte
      </h1>

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
        <button
          type="submit"
          className="rounded-full bg-[var(--color-clay)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Enregistrer
        </button>
      </form>

      <SignOutButton />
    </div>
  );
}
