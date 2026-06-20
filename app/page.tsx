import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-cream)]">
      {/* Header orange */}
      <header className="bg-[var(--color-orange)] px-6 py-4 text-center">
        <span
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Le Carnet de mon Toutou 🐾
        </span>
      </header>

      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-4xl">🐾</p>

        <h1
          className="mt-4 text-4xl font-bold text-[var(--color-orange)] sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          La médaille connectée
          <br />
          de ton toutou
        </h1>

        <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
          Scanne la médaille, contacte le propriétaire instantanément.
          Simple, rapide, efficace.
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

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-[var(--color-ink-soft)]">
          <span>🟢 100 dogpawrents conquis</span>
          <span>🔵 Page publique instantanée</span>
          <span>🟡 Design moderne</span>
        </div>
      </div>

      {/* Ticker */}
      <div className="overflow-hidden bg-[var(--color-ink)] py-3">
        <p className="animate-marquee whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white">
          {"🐾 Dessiné à la main · Conçu pour les dogpawrents · For dog lovers only · Pour tout noter de nos toutous · 🐾 Dessiné à la main · Conçu pour les dogpawrents · For dog lovers only · "}
        </p>
      </div>
    </main>
  );
}
