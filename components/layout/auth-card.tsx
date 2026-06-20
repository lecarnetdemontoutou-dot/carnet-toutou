export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-sand)] px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="text-3xl">🐾</span>
          <h1 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              {subtitle}
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-white/70 p-6 shadow-sm">{children}</div>
      </div>
    </main>
  );
}
