import { NextResponse } from "next/server";
import { getWeeklyMeta } from "@/lib/data-store";
export async function GET() { return NextResponse.json(getWeeklyMeta()); }
