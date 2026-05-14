import { NextRequest, NextResponse } from "next/server";
import { getEvents, saveEvents } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(await getEvents());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await saveEvents(data);
  return NextResponse.json({ ok: true });
}
