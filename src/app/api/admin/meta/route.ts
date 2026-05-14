import { NextRequest, NextResponse } from "next/server";
import { getWeeklyMeta, saveWeeklyMeta } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(await getWeeklyMeta());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await saveWeeklyMeta(data);
  return NextResponse.json({ ok: true });
}
