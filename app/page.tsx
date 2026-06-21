import Link from "next/link";
import { MarqueeBanner } from "@/components/layout/marquee-banner";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-cream)]">
      {/* Header orange */}
      <header className="bg-[var(--color-orange)] px-6 py-4 text-center">
        <span
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          La médaille de mon toutou 🐶
        </span>
      </header>

      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-4xl">🐾</p>

        <h1
          className="mt-4 text-4xl font-bold text-[var(--color-orange)] sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Merci pour ton achat
        </h1>

        <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
          Ici tu pourras configurer la médaille de ton toutou en quelques clics seulement.
          Simple, rapide &amp; efficace.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-full bg-[var(--color-orange)] px-8 py-3.5 font-bold text-white shadow-sm transition hover:bg-[var(--color-orange-dark)] active:scale-[0.98]"
          >
            Créer mon compte
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[var(--color-blue)] px-8 py-3.5 font-bold text-white shadow-sm transition hover:bg-[var(--color-blue-dark)] active:scale-[0.98]"
          >
            Se connecter →
          </Link>
        </div>

        <p className="mt-8 text-sm text-[var(--color-ink-soft)]">
          Retrouve toutes les infos sur{" "}
          <a href="https://www.lecarnetdemontoutou.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-orange)]">
            www.lecarnetdemontoutou.fr
          </a>
        </p>

      </div>

      <MarqueeBanner />
    </main>
  );
}
