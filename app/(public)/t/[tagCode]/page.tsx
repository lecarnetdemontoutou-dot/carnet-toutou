import { notFound } from "next/navigation";
import Image from "next/image";
import { tagRepository } from "@/server/repositories/tag.repository";
import { recordScanEvent } from "@/server/services/tracking.service";
import { TagStateScreen } from "@/components/public-profile/tag-state-screen";
import { PublicActionButton } from "@/components/public-profile/public-action-button";
import { FoundReportForm } from "@/components/public-profile/found-report-form";

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
  const settings = pet.publicSettings;

  await recordScanEvent({ tagId: tag.id, petId: pet.id, eventType: "SCAN" });

  const showLost = settings?.showLostStatus !== false && pet.isLost;
  const primaryPhone = settings?.showEmergencyPhone !== false ? pet.emergencyPhone : null;

  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      {/* Header de marque */}
      <div className="bg-[var(--color-orange)] px-5 py-3 text-center">
        <span
          className="text-lg font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Le Carnet de mon Toutou 🐾
        </span>
      </div>

      {/* Bandeau alerte chien perdu */}
      {showLost && (
        <div className="bg-[var(--color-ink)] px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white">
          🚨 {pet.name} est porté disparu — merci d'appeler immédiatement
        </div>
      )}

      <div className="mx-auto max-w-md px-5 pb-12 pt-8">
        {/* Hero : médaille + nom */}
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

          <h1
            className="mt-5 text-4xl font-bold text-[var(--color-orange)]"
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
        {(
          (settings?.showBehaviorNotes && pet.behaviorNotes) ||
          (settings?.showMedicalNotes && pet.medicalNotes) ||
          pet.emergencyInstructions ||
          (settings?.showAddress && pet.address) ||
          (settings?.showVetInfo && pet.vetName)
        ) && (
          <div className="mt-8 space-y-3">
            <h2
              className="text-center text-xl font-bold text-[var(--color-orange)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              À savoir sur {pet.name}
            </h2>

            {settings?.showBehaviorNotes && pet.behaviorNotes && (
              <InfoBlock label="Comportement" text={pet.behaviorNotes} />
            )}
            {settings?.showMedicalNotes && pet.medicalNotes && (
              <InfoBlock label="Informations médicales" text={pet.medicalNotes} emphasis />
            )}
            {pet.emergencyInstructions && (
              <InfoBlock label="Consignes d'urgence" text={pet.emergencyInstructions} emphasis />
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
        )}

        <p className="mt-8 text-center text-xs text-[var(--color-ink-soft)]">
          Merci de prendre soin de {pet.name} 🐾
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
    <div className={`rounded-2xl p-4 ${emphasis ? "bg-[var(--color-alert-soft)]" : "bg-white"}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">
        {label}
      </p>
      <p className="mt-1 text-[var(--color-ink)]">{text}</p>
    </div>
  );
}
