import { prisma } from "@/lib/db/client";
import { AdminTable } from "@/components/admin/admin-table";

export default async function AdminPetsPage() {
  const pets = await prisma.pet.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, tags: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Chiens</h1>
      <AdminTable
        columns={["Nom", "Propriétaire", "Médailles liées", "Statut"]}
        emptyLabel="Aucun chien."
        rows={pets.map((p) => [
          p.name,
          `${p.user.firstName} ${p.user.lastName}`,
          p.tags.length,
          p.isLost ? "🚨 Perdu" : "OK",
        ])}
      />
    </div>
  );
}
