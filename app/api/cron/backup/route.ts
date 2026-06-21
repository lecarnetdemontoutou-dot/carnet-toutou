import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/brevo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [users, pets, tags] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.pet.findMany({
      orderBy: { createdAt: "asc" },
      include: { user: { select: { email: true } } },
    }),
    prisma.tag.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        tagCode: true,
        activationCode: true,
        status: true,
        createdAt: true,
        activatedAt: true,
        user: { select: { email: true } },
        pet: { select: { name: true } },
      },
    }),
  ]);

  const date = new Date().toISOString().slice(0, 10);
  const backup = {
    exportedAt: new Date().toISOString(),
    counts: { users: users.length, pets: pets.length, tags: tags.length },
    users,
    pets,
    tags,
  };

  const json = JSON.stringify(backup, null, 2);
  const base64 = Buffer.from(json).toString("base64");

  await sendEmail({
    to: "lecarnetdemontoutou@gmail.com",
    subject: `💾 Sauvegarde hebdomadaire — ${date}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #e07b39;">Sauvegarde hebdomadaire</h2>
        <p style="color: #666;">Générée le ${new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #444;">Utilisateurs</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">${users.length}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #444;">Chiens enregistrés</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">${pets.length}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #444;">Médailles actives</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">${tags.filter(t => t.status === "ACTIVE").length}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #444; font-size: 14px;">
          Le fichier <strong>backup-${date}.json</strong> est joint à cet email.<br>
          Conserve-le précieusement — il contient toutes tes données.
        </p>
      </div>
    `,
    attachment: {
      name: `backup-${date}.json`,
      content: base64,
    },
  });

  return NextResponse.json({
    ok: true,
    exportedAt: backup.exportedAt,
    counts: backup.counts,
  });
}
