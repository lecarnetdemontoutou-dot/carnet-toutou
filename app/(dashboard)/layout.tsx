import Link from "next/link";
import { requireUser } from "@/lib/permissions/guards";

const NAV = [
  { href: "/dashboard", label: "Vue d'ensemble" },
  { href: "/dashboard/pets", label: "Mes chiens" },
  { href: "/dashboard/tags", label: "Mes médailles" },
  { href: "/dashboard/scans", label: "Scans" },
  { href: "/dashboard/settings", label: "Réglages" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-[var(--color-sand)]">
      <header className="border-b border-[var(--color-ring)] bg-white/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <span className="font-[var(--font-display)] text-lg font-semibold italic">
            🐾 Le Carnet de mon Toutou
          </span>
          <span className="text-sm text-[var(--color-ink-soft)]">
            {user.email}
          </span>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-5 pb-3 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-[var(--color-ink-soft)] hover:bg-[var(--color-card)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-8">{children}</main>
    </div>
  );
}
