import { prisma } from "@/lib/db/client";
import { adminDeleteUserAction } from "@/server/actions/admin-user.actions";
import { DeleteForm } from "@/components/ui/delete-form";
import { requireAdmin } from "@/lib/permissions/guards";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { pets: true, tags: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
        Utilisateurs <span className="text-base font-normal text-[var(--color-ink-soft)]">({users.length})</span>
      </h1>

      <div className="overflow-x-auto rounded-2xl bg-white/70">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-ring)] text-left text-[var(--color-ink-soft)]">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Chiens</th>
              <th className="px-4 py-3">Médailles</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Inscrit le</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              async function handleDelete() {
                "use server";
                await adminDeleteUserAction(u.id);
              }

              return (
                <tr key={u.id} className="border-b border-[var(--color-ring)]/50 last:border-0">
                  <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">{u.email}</td>
                  <td className="px-4 py-3">{u._count.pets}</td>
                  <td className="px-4 py-3">{u._count.tags}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.role === "ADMIN" ? "bg-[var(--color-orange)]/20 text-[var(--color-orange)]" : "bg-[var(--color-ring)] text-[var(--color-ink-soft)]"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">{u.createdAt.toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">
                    {u.id !== admin.id && (
                      <DeleteForm
                        action={handleDelete}
                        confirmMessage={`Supprimer ${u.firstName} ${u.lastName} (${u.email}) et toutes ses données ?`}
                        label="Supprimer"
                        className="rounded-full border border-[var(--color-alert)]/40 px-3 py-1 text-xs font-medium text-[var(--color-alert)] hover:bg-[var(--color-alert-soft)] transition"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
