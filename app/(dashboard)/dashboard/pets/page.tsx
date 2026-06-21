import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/permissions/guards";
import { petRepository } from "@/server/repositories/pet.repository";

export default async function PetsListPage() {
  const user = await requireUser();
  const pets = await petRepository.findManyByUser(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-orange)]" style={{ fontFamily: "var(--font-display)" }}>
          Mes chiens
        </h1>
        <Link
          href="/dashboard/pets/new"
          className="rounded-full bg-[var(--color-clay)] px-4 py-2 text-sm font-semibold text-white"
        >
          + Ajouter un chien
        </Link>
      </div>

      {pets.length === 0 ? (
        <p className="text-[var(--color-ink-soft)]">
          Aucun chien enregistré pour le moment.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pets.map((pet) => (
            <Link
              key={pet.id}
              href={`/dashboard/pets/${pet.id}`}
              className="flex items-center gap-4 rounded-2xl bg-white/70 p-4 transition hover:bg-white"
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl">
                {pet.photoUrl ? (
                  <Image src={pet.photoUrl} alt={pet.name} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[var(--color-orange)]/10 text-2xl">🐶</div>
                )}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-ink)]">{pet.name}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  {pet.isLost ? "🚨 Porté disparu" : pet.breed ?? "Race non renseignée"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
