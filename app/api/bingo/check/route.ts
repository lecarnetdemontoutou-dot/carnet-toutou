import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { toggleCheck } from "@/lib/bingo/store";

const bodySchema = z.object({
  index: z.number().int().min(0).max(19),
  name: z.string().trim().min(1).max(20),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const state = await toggleCheck(parsed.data.index, parsed.data.name);
  return NextResponse.json(state);
}
