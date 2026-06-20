type Props = {
  title: string;
  description: string;
};

export function TagStateScreen({ title, description }: Props) {
  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      <div className="bg-[var(--color-orange)] px-5 py-3 text-center">
        <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
          Le Carnet de mon Toutou 🐾
        </span>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="medallion mx-auto mb-6 flex items-center justify-center text-3xl">
          🐾
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-orange)]" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h1>
        <p className="mt-3 max-w-sm text-[var(--color-ink-soft)]">
          {description}
        </p>
      </div>
    </main>
  );
}
