import { NextRequest, NextResponse } from "next/server";
import { getVideos, saveVideos } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(await getVideos());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await saveVideos(data);
  return NextResponse.json({ ok: true });
}
