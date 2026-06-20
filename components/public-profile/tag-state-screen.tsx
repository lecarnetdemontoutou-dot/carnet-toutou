type Props = {
  title: string;
  description: string;
};

export function TagStateScreen({ title, description }: Props) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-sand)] px-6 text-center">
      <div className="medallion mx-auto mb-6 flex items-center justify-center text-3xl">
        🐾
      </div>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
        {title}
      </h1>
      <p className="mt-3 max-w-sm text-[var(--color-ink-soft)]">
        {description}
      </p>
    </main>
  );
}
