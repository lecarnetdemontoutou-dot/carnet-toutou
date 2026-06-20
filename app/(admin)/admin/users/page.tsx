import { prisma } from "@/lib/db/client";
import { AdminTable } from "@/components/admin/admin-table";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { pets: true, tags: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Utilisateurs</h1>
      <AdminTable
        columns={["Nom", "Email", "Chiens", "Médailles", "Rôle", "Inscrit le"]}
        emptyLabel="Aucun utilisateur."
        rows={users.map((u) => [
          `${u.firstName} ${u.lastName}`,
          u.email,
          u._count.pets,
          u._count.tags,
          u.role,
          u.createdAt.toLocaleDateString("fr-FR"),
        ])}
      />
    </div>
  );
}
