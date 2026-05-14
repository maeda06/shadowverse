import { NextResponse } from "next/server";
import { getDecks } from "@/lib/data-store";
export async function GET() { return NextResponse.json(await getDecks()); }
