import Link from "next/link";
import { requireAdmin } from "@/lib/permissions/guards";
import { SignOutButton } from "@/components/forms/sign-out-button";
import { MarqueeBanner } from "@/components/layout/marquee-banner";

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
    <div className="min-h-screen bg-[var(--color-cream)]">
      <header className="bg-[var(--color-orange)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/admin">
            <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              La médaille de mon toutou 🐶
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white/80">Admin</span>
            <SignOutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 pb-3">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/20 hover:text-white transition">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
      <MarqueeBanner />
    </div>
  );
}
