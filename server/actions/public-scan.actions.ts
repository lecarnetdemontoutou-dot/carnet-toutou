"use server";

import { headers } from "next/headers";
import { recordScanEvent } from "@/server/services/tracking.service";
import { foundReportSchema } from "@/lib/validators/schemas";
import { tagRepository } from "@/server/repositories/tag.repository";
import { prisma } from "@/lib/db/client";

// Rate limit simple : max 5 signalements par IP par heure
const reportRateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = reportRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    reportRateLimit.set(ip, { count: 1, resetAt: now + 3600_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

/**
 * Enregistre un clic sur "Appeler" ou "SMS" depuis la page publique.
 * Appelée juste avant la redirection tel: / sms:.
 */
export async function recordPublicActionAction(params: {
  tagId: string;
  petId: string | null;
  eventType: "CALL_CLICK" | "SMS_CLICK";
}) {
  await recordScanEvent(params);
  return { ok: true };
}

export type FoundReportFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

/**
 * Traite le formulaire public "J'ai trouvé ce chien".
 * Aucune authentification requise — validation stricte côté serveur,
 * honeypot anti-spam minimal.
 */
export async function submitFoundReportAction(
  _prev: FoundReportFormState,
  formData: FormData
): Promise<FoundReportFormState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return { status: "error", message: "Trop de tentatives. Réessaie dans une heure." };
  }

  const parsed = foundReportSchema.safeParse({
    tagCode: formData.get("tagCode"),
    finderName: formData.get("finderName"),
    finderPhone: formData.get("finderPhone"),
    message: formData.get("message") || undefined,
    locationText: formData.get("locationText") || undefined,
    website: formData.get("website") || undefined, // honeypot
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  // Honeypot rempli => probable bot, on répond succès sans rien enregistrer
  if (parsed.data.website) {
    return { status: "success" };
  }

  const tag = await tagRepository.findByTagCode(parsed.data.tagCode);
  if (!tag || !tag.petId) {
    return { status: "error", message: "Cette médaille n'est plus valide." };
  }

  await prisma.foundReport.create({
    data: {
      petId: tag.petId,
      tagId: tag.id,
      finderName: parsed.data.finderName,
      finderPhone: parsed.data.finderPhone,
      message: parsed.data.message,
      locationText: parsed.data.locationText,
    },
  });

  await recordScanEvent({
    tagId: tag.id,
    petId: tag.petId,
    eventType: "FOUND_CLICK",
  });

  return { status: "success" };
}
