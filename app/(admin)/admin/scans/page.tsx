import { prisma } from "@/lib/db/client";
import { AdminTable } from "@/components/admin/admin-table";

export default async function AdminScansPage() {
  const scans = await prisma.scanEvent.findMany({
    orderBy: { scannedAt: "desc" },
    take: 100,
    include: { pet: true, tag: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Scans</h1>
      <AdminTable
        columns={["Date", "Médaille", "Chien", "Type", "Localisation"]}
        emptyLabel="Aucun scan."
        rows={scans.map((s) => [
          s.scannedAt.toLocaleString("fr-FR"),
          s.tag.tagCode,
          s.pet?.name ?? "—",
          s.eventType,
          [s.city, s.country].filter(Boolean).join(", ") || "—",
        ])}
      />
    </div>
  );
}
