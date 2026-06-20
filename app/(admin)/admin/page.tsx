import { prisma } from "@/lib/db/client";

export default async function AdminHomePage() {
  const [users, pets, tags, scansToday] = await Promise.all([
    prisma.user.count(),
    prisma.pet.count(),
    prisma.tag.count(),
    prisma.scanEvent.count({
      where: { scannedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Vue d&apos;ensemble</h1>
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Utilisateurs", users],
          ["Chiens", pets],
          ["Médailles", tags],
          ["Scans aujourd'hui", scansToday],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-2xl bg-white/70 p-5">
            <p className="text-3xl font-semibold text-[var(--color-ink)]">{value}</p>
            <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
