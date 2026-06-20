import { notFound } from "next/navigation";
import Image from "next/image";
import { tagRepository } from "@/server/repositories/tag.repository";
import { recordScanEvent } from "@/server/services/tracking.service";
import { TagStateScreen } from "@/components/public-profile/tag-state-screen";
import { PublicActionButton } from "@/components/public-profile/public-action-button";
import { FoundReportForm } from "@/components/public-profile/found-report-form";

export const dynamic = "force-dynamic"; // chaque scan doit être enregistré, pas de cache

export default async function PublicScanPage({
  params,
}: {
  params: Promise<{ tagCode: string }>;
}) {
  const { tagCode } = await params;
  const tag = await tagRepository.findByTagCode(tagCode);

  if (!tag) {
    notFound();
  }

  if (tag.status === "DISABLED") {
    return (
      <TagStateScreen
        title="Médaille désactivée"
        description="Cette médaille a été désactivée par son propriétaire et n'est plus active."
      />
    );
  }

  if (tag.status === "REPLACED" || tag.status === "ARCHIVED") {
    return (
      <TagStateScreen
        title="Médaille remplacée"
        description="Cette médaille n'est plus en service. Une nouvelle médaille a probablement été activée."
      />
    );
  }

  if (tag.status === "UNASSIGNED" || !tag.pet) {
    return (
      <TagStateScreen
        title="Médaille pas encore activée"
        description="Cette médaille n'a pas encore été reliée à un chien. Si vous êtes le propriétaire, activez-la depuis votre compte."
      />
    );
  }

  const pet = tag.pet;
  const settings = pet.publicSettings;

  // On enregistre le scan à chaque ouverture de la page (avant le rendu, sans bloquer l'UX)
  await recordScanEvent({ tagId: tag.id, petId: pet.id, eventType: "SCAN" });

  const showLost = settings?.showLostStatus !== false && pet.isLost;
  const primaryPhone = pet.emergencyPhone;

  return (
    <main className="min-h-screen bg-[var(--color-sand)] pb-10">
      {showLost && (
        <div className="bg-[var(--color-alert)] py-2 text-center text-sm font-semibold text-white">
          🚨 {pet.name} est actuellement porté disparu
        </div>
      )}

      <div className="mx-auto max-w-md px-5 pt-8">
        {/* --- Hero : la médaille --- */}
        <div className="flex flex-col items-center text-center">
          <div className="medallion">
            {pet.photoUrl ? (
              <Image
                src={pet.photoUrl}
                alt={pet.name}
                fill
                className="object-cover"
                sizes="152px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl">
                🐶
              </div>
            )}
          </div>

          <h1 className="mt-5 font-[var(--font-display)] text-3xl font-semibold italic text-[var(--color-ink)]">
            {pet.name}
          </h1>

          <div className="engraved-rule mx-auto mt-3 w-24" />

          {pet.publicMessage && (
            <p className="mt-4 text-[var(--color-ink-soft)]">
              {pet.publicMessage}
            </p>
          )}
        </div>

        {/* --- Actions immédiates : visibles sans scroll --- */}
        <div className="mt-7 space-y-3">
          {primaryPhone && (
            <PublicActionButton
              tagId={tag.id}
              petId={pet.id}
              phone={primaryPhone}
              mode="call"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-clay)] px-5 py-4 text-lg font-semibold text-white shadow-[0_8px_20px_-6px_rgba(193,105,79,0.6)] transition active:scale-[0.98]"
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
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-sage)] px-5 py-3.5 font-semibold text-white transition active:scale-[0.98]"
            >
              💬 Envoyer un SMS
            </PublicActionButton>
          )}

          <FoundReportForm tagCode={tagCode} />
        </div>

        {/* --- Bloc infos utiles --- */}
        <div className="mt-8 space-y-3">
          {settings?.showBehaviorNotes && pet.behaviorNotes && (
            <InfoBlock label="Comportement" text={pet.behaviorNotes} />
          )}
          {settings?.showMedicalNotes && pet.medicalNotes && (
            <InfoBlock label="Informations médicales" text={pet.medicalNotes} emphasis />
          )}
          {pet.emergencyInstructions && (
            <InfoBlock label="Consignes en cas d'urgence" text={pet.emergencyInstructions} emphasis />
          )}
          {settings?.showAddress && pet.address && (
            <InfoBlock label="Adresse du domicile" text={pet.address} />
          )}
          {settings?.showVetInfo && pet.vetName && (
            <InfoBlock
              label="Vétérinaire"
              text={`${pet.vetName}${pet.vetPhone ? ` — ${pet.vetPhone}` : ""}`}
            />
          )}
        </div>

        <p className="mt-8 text-center text-xs text-[var(--color-ink-soft)]">
          Merci de prendre soin de {pet.name} en attendant de joindre son
          propriétaire 🐾
        </p>
      </div>
    </main>
  );
}

function InfoBlock({
  label,
  text,
  emphasis,
}: {
  label: string;
  text: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        emphasis
          ? "bg-[var(--color-alert-soft)]"
          : "bg-[var(--color-card)]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
        {label}
      </p>
      <p className="mt-1 text-[var(--color-ink)]">{text}</p>
    </div>
  );
}
