import { NextResponse } from "next/server";
import { markNotified } from "@/lib/bingo/store";

export async function POST() {
  const result = await markNotified();
  return NextResponse.json(result);
}
