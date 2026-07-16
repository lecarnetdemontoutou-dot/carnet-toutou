"use server";

import { sendSms } from "@/lib/sms/brevo";

export async function sendLocationAction({
  petName,
  phone,
  lat,
  lng,
}: {
  petName: string;
  phone: string;
  lat: number;
  lng: number;
}) {
  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
  const message = `🐾 ${petName} a été trouvé(e) ! Localisation du trouveur : ${mapsUrl}`;
  await sendSms({ to: phone, message });
}
