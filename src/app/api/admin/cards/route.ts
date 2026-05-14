import { NextRequest, NextResponse } from "next/server";
import { getCardEvaluations, saveCardEvaluations } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(await getCardEvaluations());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await saveCardEvaluations(data);
  return NextResponse.json({ ok: true });
}
