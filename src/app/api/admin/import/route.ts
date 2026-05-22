import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_VALUE } from "@/lib/admin-auth";
import type { Deck, ClassName } from "@/lib/types";

const TEMPLATE_HEADERS = [
  "name", "class", "archetype", "rank", "win_rate", "usage_rate",
  "prev_win_rate", "difficulty", "cost_level", "tags", "description",
  "strategy", "key_cards", "sample_count",
];

const TEMPLATE_ROWS = [
  [
    "連携ロイヤル", "ロイヤル", "Midrange", "1", "54.2", "18.5", "52.1",
    "3", "3", "初心者向け;大会実績あり",
    "連携スタックを活かして中盤から一気に展開するデッキ",
    "序盤は連携を積み重ね、中盤のフォロワー展開で盤面制圧を目指す",
    "ルシア;ランスロット;アーサー", "342",
  ],
];

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), vals[i] ?? ""]));
  });
}

function rowToDeck(row: Record<string, string>, index: number): Deck {
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  return {
    id: `imported-${Date.now()}-${index}`,
    name: row.name || `デッキ${index + 1}`,
    className: (row.class || "ドラゴン") as ClassName,
    archetype: row.archetype || "Midrange",
    rank: parseInt(row.rank) || 99,
    winRate: parseFloat(row.win_rate) || 50,
    usageRate: parseFloat(row.usage_rate) || 0,
    prevWinRate: parseFloat(row.prev_win_rate) || 50,
    difficulty: clamp(parseInt(row.difficulty) || 3, 1, 5) as Deck["difficulty"],
    costLevel: clamp(parseInt(row.cost_level) || 3, 1, 5) as Deck["costLevel"],
    tags: row.tags ? row.tags.split(";").map(s => s.trim()).filter(Boolean) : [],
    description: row.description || "",
    strategy: row.strategy || "",
    keyCards: row.key_cards ? row.key_cards.split(";").map(s => s.trim()).filter(Boolean) : [],
    keyCardImages: [],
    sampleCount: parseInt(row.sample_count) || 0,
    imageUrl: "",
  };
}

// GET: テンプレートCSVをダウンロード
export async function GET() {
  const rows = [TEMPLATE_HEADERS, ...TEMPLATE_ROWS];
  const csv = rows.map(row =>
    row.map(cell => (cell.includes(",") || cell.includes('"') || cell.includes("\n"))
      ? `"${cell.replace(/"/g, '""')}"` : cell
    ).join(",")
  ).join("\n");

  return new NextResponse("﻿" + csv, {  // BOM付きでExcelが文字化けしない
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="deck_template.csv"',
    },
  });
}

// POST: CSVをパースしてDeck[]を返す（保存はしない）
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)?.value !== SESSION_VALUE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const text = await file.text();
  const rows = parseCSV(text);

  if (rows.length === 0) {
    return NextResponse.json({ error: "CSVにデータがありません" }, { status: 400 });
  }

  const decks = rows.map((row, i) => rowToDeck(row, i));
  return NextResponse.json({ decks, count: decks.length });
}
