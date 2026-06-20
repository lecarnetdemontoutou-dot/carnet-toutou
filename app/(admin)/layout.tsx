import Link from "next/link";
import { requireAdmin } from "@/lib/permissions/guards";

const NAV = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/pets", label: "Chiens" },
  { href: "/admin/tags", label: "Médailles" },
  { href: "/admin/scans", label: "Scans" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[var(--color-sand)]">
      <header className="border-b border-[var(--color-ring)] bg-[var(--color-ink)]">
        <div className="mx-auto max-w-5xl px-5 py-4">
          <span className="font-semibold text-[var(--color-sand)]">🛠️ Admin — Le Carnet de mon Toutou</span>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 pb-3 text-sm">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full px-3 py-1.5 text-[var(--color-sand)]/80 hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
