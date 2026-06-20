import { headers } from "next/headers";
import { prisma } from "@/lib/db/client";
import type { ScanEventType } from "@prisma/client";

/**
 * Enregistre un événement de scan ou d'action publique (appel, SMS, signalement).
 * Lit les en-têtes fournis gratuitement par Vercel pour la géolocalisation
 * approximative (pas de service tiers, pas de complexité ajoutée).
 */
export async function recordScanEvent(params: {
  tagId: string;
  petId?: string | null;
  eventType: ScanEventType;
}) {
  const h = await headers();

  await prisma.scanEvent.create({
    data: {
      tagId: params.tagId,
      petId: params.petId ?? null,
      eventType: params.eventType,
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: h.get("user-agent") ?? null,
      referer: h.get("referer") ?? null,
      country: h.get("x-vercel-ip-country") ?? null,
      city: h.get("x-vercel-ip-city") ?? null,
    },
  });
}
