import { NextResponse } from "next/server";
import { resetChecks } from "@/lib/bingo/store";

export async function POST() {
  const state = await resetChecks();
  return NextResponse.json(state);
}
