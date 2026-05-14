import { NextResponse } from "next/server";
import { getVideos } from "@/lib/data-store";
export async function GET() { return NextResponse.json(getVideos()); }
