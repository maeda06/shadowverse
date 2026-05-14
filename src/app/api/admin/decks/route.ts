import { NextRequest, NextResponse } from "next/server";
import { getDecks, saveDecks } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(await getDecks());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await saveDecks(data);
  return NextResponse.json({ ok: true });
}
