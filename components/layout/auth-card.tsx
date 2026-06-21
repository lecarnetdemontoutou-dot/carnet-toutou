import { MarqueeBanner } from "@/components/layout/marquee-banner";

export function AuthCard({
  title,
  subtitle,
  children,
  logoHref = "/",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  logoHref?: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[var(--color-cream)]">
      {/* Barre de marque orange */}
      <div className="w-full bg-[var(--color-orange)] px-6 py-4 text-center">
        <a href={logoHref} className="inline-block">
          <span
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            La médaille de mon toutou 🐶
          </span>
        </a>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1
              className="text-3xl font-bold text-[var(--color-orange)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {subtitle}
              </p>
            )}
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">{children}</div>
        </div>
      </div>
    </main>
  );
}
