"use server";

import { prisma } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/brevo";

export async function sendLocationAction({
  petId,
  petName,
  lat,
  lng,
}: {
  petId: string;
  petName: string;
  lat: number;
  lng: number;
}) {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: { user: { select: { email: true, firstName: true } } },
  });

  if (!pet?.user?.email) throw new Error("Propriétaire introuvable");

  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

  await sendEmail({
    to: pet.user.email,
    subject: `📍 ${petName} a été trouvé(e) !`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #e07b39;">Bonne nouvelle !</h2>
        <p>Bonjour ${pet.user.firstName},</p>
        <p>Quelqu'un a trouvé <strong>${petName}</strong> et partage sa localisation avec toi.</p>
        <div style="margin: 24px 0;">
          <a href="${mapsUrl}" style="background: #e07b39; color: white; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 16px;">
            📍 Voir la localisation
          </a>
        </div>
        <p style="color: #666; font-size: 13px;">Rejoins vite ${petName} ! 🐾</p>
      </div>
    `,
  });
}
