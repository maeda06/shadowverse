import { NextRequest, NextResponse } from "next/server";
import { getWeeklyMeta, saveWeeklyMeta } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(getWeeklyMeta());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  saveWeeklyMeta(data);
  return NextResponse.json({ ok: true });
}
