import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  // Vérifie que la base de données répond
  await prisma.$queryRaw`SELECT 1`;

  return NextResponse.json({
    ok: true,
    db: "up",
    latency: `${Date.now() - start}ms`,
    ts: new Date().toISOString(),
  });
}
