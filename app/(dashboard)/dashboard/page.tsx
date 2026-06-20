import Link from "next/link";
import { requireUser } from "@/lib/permissions/guards";
import { petRepository } from "@/server/repositories/pet.repository";
import { tagRepository } from "@/server/repositories/tag.repository";
import { prisma } from "@/lib/db/client";

export default async function DashboardHomePage() {
  const user = await requireUser();
  const [pets, tags] = await Promise.all([
    petRepository.findManyByUser(user.id),
    tagRepository.findManyByUser(user.id),
  ]);

  const recentScans = await prisma.scanEvent.findMany({
    where: { tag: { userId: user.id } },
    orderBy: { scannedAt: "desc" },
    take: 5,
    include: { pet: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-semibold italic">
          Bonjour {user.firstName ?? ""} 👋
        </h1>
        <p className="text-[var(--color-ink-soft)]">
          Voici un aperçu de tes chiens et de tes médailles.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Chiens" value={pets.length} href="/dashboard/pets" />
        <StatCard label="Médailles" value={tags.length} href="/dashboard/tags" />
        <StatCard
          label="Médailles actives"
          value={tags.filter((t) => t.status === "ACTIVE").length}
          href="/dashboard/tags"
        />
      </div>

      {pets.length === 0 && (
        <EmptyState
          title="Aucun chien pour le moment"
          description="Crée la fiche de ton chien pour pouvoir activer une médaille."
          actionHref="/dashboard/pets/new"
          actionLabel="Créer la fiche de mon chien"
        />
      )}

      <div>
        <h2 className="mb-3 font-semibold text-[var(--color-ink)]">
          Scans récents
        </h2>
        {recentScans.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">
            Aucun scan enregistré pour l&apos;instant.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--color-ring)] rounded-2xl bg-white/60">
            {recentScans.map((scan) => (
              <li key={scan.id} className="flex justify-between px-4 py-3 text-sm">
                <span>{scan.pet?.name ?? "Chien inconnu"}</span>
                <span className="text-[var(--color-ink-soft)]">
                  {scan.scannedAt.toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white/70 p-5 transition hover:bg-white"
    >
      <p className="text-3xl font-semibold text-[var(--color-ink)]">{value}</p>
      <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
    </Link>
  );
}

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-2xl bg-[var(--color-card)] p-6 text-center">
      <p className="font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{description}</p>
      <Link
        href={actionHref}
        className="mt-4 inline-block rounded-full bg-[var(--color-clay)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
