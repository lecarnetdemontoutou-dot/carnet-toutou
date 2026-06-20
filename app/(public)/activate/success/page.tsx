import Link from "next/link";
import { AuthCard } from "@/components/layout/auth-card";

export default function ActivateSuccessPage() {
  return (
    <AuthCard title="Médaille activée 🎉">
      <p className="text-center text-[var(--color-ink-soft)]">
        Ta médaille est maintenant active. Pense à compléter la fiche de ton
        chien avec ses informations de contact pour que les bonnes personnes
        puissent te joindre rapidement.
      </p>
      <Link
        href="/dashboard/pets"
        className="mt-6 block w-full rounded-full bg-[var(--color-clay)] px-5 py-3 text-center font-semibold text-white"
      >
        Compléter la fiche de mon chien
      </Link>
    </AuthCard>
  );
}
