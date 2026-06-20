import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-sand)] px-6 text-center">
      <div className="medallion mb-6 flex items-center justify-center text-4xl">🐾</div>
      <h1 className="font-[var(--font-display)] text-3xl font-semibold italic text-[var(--color-ink)]">
        Le Carnet de mon Toutou
      </h1>
      <p className="mt-3 max-w-md text-[var(--color-ink-soft)]">
        Des médailles NFC qui ouvrent une page web instantanée pour aider à
        retrouver rapidement le propriétaire d&apos;un chien.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/register" className="rounded-full bg-[var(--color-clay)] px-6 py-3 font-semibold text-white">
          Créer mon compte
        </Link>
        <Link href="/login" className="rounded-full border border-[var(--color-ring)] px-6 py-3 font-semibold text-[var(--color-ink)]">
          Se connecter
        </Link>
      </div>
    </main>
  );
}
