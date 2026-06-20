import { prisma } from "@/lib/db/client";
import { createTagBatchAction } from "@/server/actions/admin-tag.actions";
import { TagAdminActions } from "@/components/admin/tag-admin-actions";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, pet: true },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Médailles</h1>
        <div className="flex flex-wrap items-center gap-2">
          <form action={createTagBatchAction} className="flex items-center gap-2">
            <input
              type="number"
              name="count"
              defaultValue={10}
              min={1}
              max={100}
              className="w-20 rounded-xl border border-[var(--color-ring)] bg-white px-2 py-1.5 text-sm"
            />
            <button className="rounded-full bg-[var(--color-clay)] px-4 py-2 text-sm font-semibold text-white">
              Générer un lot
            </button>
          </form>
          <a
            href="/admin/tags/export"
            className="rounded-full border border-[var(--color-ring)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-sand)]"
          >
            ↓ Exporter CSV (non assignées)
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white/70">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-ring)] text-left text-[var(--color-ink-soft)]">
              <th className="px-4 py-3">tagCode</th>
              <th className="px-4 py-3">activationCode</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Propriétaire</th>
              <th className="px-4 py-3">Chien</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-b border-[var(--color-ring)]/50">
                <td className="px-4 py-3 font-mono text-xs">{tag.tagCode}</td>
                <td className="px-4 py-3 font-mono text-xs">{tag.activationCode}</td>
                <td className="px-4 py-3">{tag.status}</td>
                <td className="px-4 py-3">{tag.user ? `${tag.user.firstName} ${tag.user.lastName}` : "—"}</td>
                <td className="px-4 py-3">{tag.pet?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <TagAdminActions tagId={tag.id} status={tag.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
