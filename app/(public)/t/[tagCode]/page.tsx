import { notFound } from "next/navigation";
import Image from "next/image";
import { tagRepository } from "@/server/repositories/tag.repository";
import { recordScanEvent } from "@/server/services/tracking.service";
import { TagStateScreen } from "@/components/public-profile/tag-state-screen";
import { PublicActionButton } from "@/components/public-profile/public-action-button";
import { FoundReportForm } from "@/components/public-profile/found-report-form";
import { InfoAccordion } from "@/components/public-profile/info-accordion";

export const dynamic = "force-dynamic";

export default async function PublicScanPage({
  params,
}: {
  params: Promise<{ tagCode: string }>;
}) {
  const { tagCode } = await params;
  const tag = await tagRepository.findByTagCode(tagCode);

  if (!tag) notFound();

  if (tag.status === "DISABLED") {
    return (
      <TagStateScreen
        title="Médaille désactivée"
        description="Cette médaille a été désactivée par son propriétaire."
      />
    );
  }

  if (tag.status === "REPLACED" || tag.status === "ARCHIVED") {
    return (
      <TagStateScreen
        title="Médaille remplacée"
        description="Cette médaille n'est plus en service. Une nouvelle a probablement été activée."
      />
    );
  }

  if (tag.status === "UNASSIGNED" || !tag.pet) {
    return (
      <TagStateScreen
        title="Médaille pas encore activée"
        description="Cette médaille n'a pas encore été reliée à un chien."
      />
    );
  }

  const pet = tag.pet;

  await recordScanEvent({ tagId: tag.id, petId: pet.id, eventType: "SCAN" });

  const primaryPhone = pet.emergencyPhone;

  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      {/* Header de marque */}
      <div className="bg-[var(--color-orange)] px-5 py-3 text-center">
        <span
          className="text-lg font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          La médaille de mon toutou 🐶
        </span>
      </div>

      {/* Bandeau alerte chien perdu */}
      {pet.isLost && (
        <div className="bg-red-600 px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-white">
          🚨 {pet.name} est porté disparu — merci d'appeler immédiatement
        </div>
      )}

      <div className="mx-auto max-w-md px-5 pb-12 pt-8">
        {/* Photo + nom */}
        <div className="flex flex-col items-center text-center">
          {pet.photoUrl ? (
            <div className="relative h-36 w-36 overflow-hidden rounded-3xl shadow-md">
              <Image
                src={pet.photoUrl}
                alt={pet.name}
                fill
                className="object-cover"
                sizes="144px"
                priority
              />
            </div>
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-[var(--color-orange)]/10 text-5xl">
              🐶
            </div>
          )}

          <h1
            className="mt-4 text-4xl font-bold text-[var(--color-orange)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {pet.name}
          </h1>

          {pet.publicMessage && (
            <p className="mt-3 text-[var(--color-ink-soft)]">
              {pet.publicMessage}
            </p>
          )}
        </div>

        {/* Actions principales */}
        <div className="mt-8 space-y-3">
          {primaryPhone && (
            <PublicActionButton
              tagId={tag.id}
              petId={pet.id}
              phone={primaryPhone}
              mode="call"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-orange)] px-5 py-4 text-lg font-bold text-white shadow-md transition active:scale-[0.98]"
            >
              📞 Appeler le propriétaire
            </PublicActionButton>
          )}

          {primaryPhone && (
            <PublicActionButton
              tagId={tag.id}
              petId={pet.id}
              phone={primaryPhone}
              mode="sms"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-blue)] px-5 py-3.5 font-bold text-white transition active:scale-[0.98]"
            >
              💬 Envoyer un SMS
            </PublicActionButton>
          )}

          <FoundReportForm tagCode={tagCode} />
        </div>

        {/* Informations utiles */}
        {(pet.behaviorNotes || pet.medicalNotes || pet.distinctiveFeatures || pet.emergencyInstructions || pet.address || pet.vetName) && (
          <div className="mt-8">
            <h2
              className="mb-3 text-center text-xl font-bold text-[var(--color-orange)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              À savoir sur {pet.name}
            </h2>

            <InfoAccordion
              items={[
                pet.behaviorNotes ? { label: "Comportement", text: pet.behaviorNotes } : null,
                pet.distinctiveFeatures ? { label: "Signes distinctifs", text: pet.distinctiveFeatures } : null,
                pet.medicalNotes ? { label: "Informations médicales", text: pet.medicalNotes, emphasis: true } : null,
                pet.emergencyInstructions ? { label: "Consignes d'urgence", text: pet.emergencyInstructions, emphasis: true } : null,
                pet.address ? { label: "Adresse du domicile", text: pet.address } : null,
                pet.vetName ? { label: "Vétérinaire", text: `${pet.vetName}${pet.vetPhone ? ` — ${pet.vetPhone}` : ""}` } : null,
              ].filter(Boolean) as { label: string; text: string; emphasis?: boolean }[]}
            />
          </div>
        )}

        <p className="mt-8 text-center text-xs text-[var(--color-ink-soft)]">
          Merci de prendre soin de {pet.name} 🐾
        </p>

        <div className="mt-6 text-center">
          <a
            href={`/login?redirectTo=/dashboard/pets/${pet.id}`}
            className="text-xs text-[var(--color-ink-soft)]/50 hover:text-[var(--color-ink-soft)] transition underline underline-offset-2"
          >
            C&apos;est mon chien
          </a>
        </div>
      </div>
    </main>
  );
}
