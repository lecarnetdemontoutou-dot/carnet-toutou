import Link from "next/link";
import { requireUser } from "@/lib/permissions/guards";
import { SignOutButton } from "@/components/forms/sign-out-button";


const NAV = [
  { href: "/dashboard", label: "Accueil" },
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
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Barre de navigation orange */}
      <header className="bg-[var(--color-orange)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Link href="/dashboard">
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Le Carnet de mon Toutou 🐾
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white/80">{user.firstName}</span>
            <SignOutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-5 pb-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/20 hover:text-white transition"
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
