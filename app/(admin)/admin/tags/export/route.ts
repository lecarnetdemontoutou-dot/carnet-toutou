import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions/guards";
import { prisma } from "@/lib/db/client";

export async function GET() {
  await requireAdmin();

  const tags = await prisma.tag.findMany({
    where: { status: "UNASSIGNED" },
    orderBy: { createdAt: "desc" },
    select: { tagCode: true, activationCode: true, createdAt: true },
  });

  const baseUrl = "https://app.lecarnetdemontoutou.fr";
  const rows = [
    ["N°", "URL NFC (à programmer sur la puce)", "Code d'activation (pré-rempli dans l'URL)", "Créée le"],
    ...tags.map((t, i) => [
      String(i + 1),
      `${baseUrl}/t/${t.tagCode}`,
      t.activationCode,
      t.createdAt.toISOString().slice(0, 10),
    ]),
  ];

  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="medailles-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
