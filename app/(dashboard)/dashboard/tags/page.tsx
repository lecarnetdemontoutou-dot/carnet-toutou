import { requireUser } from "@/lib/permissions/guards";
import { tagRepository } from "@/server/repositories/tag.repository";

const STATUS_LABELS: Record<string, string> = {
  UNASSIGNED: "Non activée",
  ACTIVE: "Active",
  DISABLED: "Désactivée",
  REPLACED: "Remplacée",
  ARCHIVED: "Archivée",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-[var(--color-sage)]/15 text-[var(--color-sage-dark)]",
  UNASSIGNED: "bg-[var(--color-ring)]/40 text-[var(--color-ink-soft)]",
  DISABLED: "bg-[var(--color-alert-soft)] text-[var(--color-alert)]",
  REPLACED: "bg-[var(--color-alert-soft)] text-[var(--color-alert)]",
  ARCHIVED: "bg-[var(--color-ring)]/40 text-[var(--color-ink-soft)]",
};

export default async function TagsPage() {
  const user = await requireUser();
  const tags = await tagRepository.findManyByUser(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-orange)]" style={{ fontFamily: "var(--font-display)" }}>
          Mes médailles
        </h1>
        <p className="text-[var(--color-ink-soft)]">
          Pour activer une nouvelle médaille, rends-toi sur{" "}
          <a href="/activate" className="underline">/activate</a>.
        </p>
      </div>

      {tags.length === 0 ? (
        <p className="text-[var(--color-ink-soft)]">Aucune médaille activée pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between rounded-2xl bg-white/70 p-4">
              <div>
                <p className="font-medium text-[var(--color-ink)]">/t/{tag.tagCode}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  {tag.pet ? `Liée à ${tag.pet.name}` : "Aucun chien lié"}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[tag.status]}`}>
                {STATUS_LABELS[tag.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
