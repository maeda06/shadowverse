"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CARD_EVALUATIONS } from "@/lib/mock-data";
import { CLASS_TEXT_COLORS, CLASS_BG_COLORS } from "@/lib/class-colors";
import { ClassIcon } from "@/components/ClassIcon";
import type { ClassName } from "@/lib/types";

const RATING_COLORS: Record<string, string> = {
  S: "text-red-400 bg-red-950/50 border-red-700",
  A: "text-amber-400 bg-amber-950/50 border-amber-700",
  B: "text-blue-400 bg-blue-950/50 border-blue-700",
  C: "text-slate-400 bg-slate-800/50 border-slate-600",
  D: "text-slate-500 bg-slate-900/50 border-slate-700",
};

const RARITY_COLORS: Record<string, string> = {
  Legendary: "text-amber-400",
  Gold: "text-yellow-500",
  Silver: "text-slate-300",
  Bronze: "text-amber-700",
};

const ALL_CLASSES: ClassName[] = [
  "エルフ", "ロイヤル", "ウィッチ", "ドラゴン", "ナイトメア", "ビショップ", "ネメシス",
];

export default function CardsPage() {
  const [selectedClass, setSelectedClass] = useState<ClassName | "all">("all");
  const [selectedRating, setSelectedRating] = useState<string | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = CARD_EVALUATIONS.filter((c) => {
    if (selectedClass !== "all" && c.className !== selectedClass) return false;
    if (selectedRating !== "all" && c.rating !== selectedRating) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">カード評価</h1>
        <p className="text-sm text-muted-foreground">
          最新弾のカードを環境への影響度・汎用性・採用優先度で評価します
        </p>
      </div>

      {/* Rating Guide */}
      <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
        <span>評価基準:</span>
        {["S", "A", "B", "C", "D"].map((r) => (
          <span key={r} className={`px-2 py-0.5 rounded border text-xs font-bold ${RATING_COLORS[r]}`}>
            {r}
            {r === "S" && " — 必須級"}
            {r === "A" && " — 有力"}
            {r === "B" && " — 採用候補"}
            {r === "C" && " — 状況次第"}
            {r === "D" && " — 採用非推奨"}
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedClass("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedClass === "all"
                ? "bg-amber-400 text-black"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            全クラス
          </button>
          {ALL_CLASSES.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls === selectedClass ? "all" : cls)}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 font-medium transition-colors ${
                selectedClass === cls
                  ? `${CLASS_BG_COLORS[cls]} ${CLASS_TEXT_COLORS[cls]}`
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <ClassIcon name={cls} size={16} /> {cls}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {["all", "S", "A", "B", "C"].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(r === selectedRating ? "all" : r)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedRating === r
                  ? r === "all"
                    ? "bg-amber-400 text-black"
                    : `border ${RATING_COLORS[r]}`
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "all" ? "全評価" : `${r}ランク`}
            </button>
          ))}
        </div>
      </div>

      {/* Card List */}
      <div className="space-y-3">
        {filtered.map((card) => {
          const isExpanded = expandedId === card.id;
          return (
            <Card key={card.id} className="bg-card/50 overflow-hidden">
              <CardContent className="p-0">
                <button
                  className="w-full text-left p-4"
                  onClick={() => setExpandedId(isExpanded ? null : card.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-black ${RATING_COLORS[card.rating]}`}
                    >
                      {card.rating}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <ClassIcon name={card.className} size={22} />
                        <span className="font-bold">{card.cardName}</span>
                        <span className={`text-xs font-medium ${RARITY_COLORS[card.rarity]}`}>
                          {card.rarity}
                        </span>
                        <span className="text-xs text-muted-foreground">{card.cost}PP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${CLASS_TEXT_COLORS[card.className]}`}>
                          {card.className}
                        </span>
                        <span className="text-xs text-muted-foreground">{card.setName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{card.summary}</p>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/40 p-4 bg-black/20">
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                    <p className="text-xs text-muted-foreground mt-3">評価日: {card.publishedAt}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>条件に一致するカードが見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
