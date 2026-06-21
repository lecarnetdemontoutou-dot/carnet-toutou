import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions/guards";
import { prisma } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAdmin();

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

  const backup = {
    exportedAt: new Date().toISOString(),
    counts: { users: users.length, pets: pets.length, tags: tags.length },
    users,
    pets,
    tags,
  };

  const json = JSON.stringify(backup, null, 2);
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="backup-${date}.json"`,
    },
  });
}
