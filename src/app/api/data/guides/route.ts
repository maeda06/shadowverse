import { NextResponse } from "next/server";
import { getGuides } from "@/lib/data-store";
export async function GET() { return NextResponse.json(getGuides()); }
