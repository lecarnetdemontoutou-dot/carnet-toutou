import { prisma } from "@/lib/db/client";
import { createTagBatchAction } from "@/server/actions/admin-tag.actions";
import { TagsTable } from "@/components/admin/tags-table";

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

      <TagsTable tags={tags} />
    </div>
  );
}
