import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateCells } from "@/lib/bingo/store";

const bodySchema = z.object({
  adminCode: z.literal("ORIANE2026"),
  cells: z
    .array(
      z.object({
        text: z.string().trim().min(1).max(200),
        points: z.number().int().min(0).max(1000),
      })
    )
    .length(20),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const state = await updateCells(parsed.data.cells);
  return NextResponse.json(state);
}
