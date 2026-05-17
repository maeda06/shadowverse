"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CLASS_TEXT_COLORS, CLASS_BG_COLORS } from "@/lib/class-colors";
import { ClassIcon } from "@/components/ClassIcon";
import type { Deck, ClassName } from "@/lib/types";

const DIFFICULTY_LABELS = ["", "★☆☆☆☆", "★★☆☆☆", "★★★☆☆", "★★★★☆", "★★★★★"];
const COST_LABELS = ["", "極低", "低", "中", "高", "最高"];

const ALL_CLASSES: ClassName[] = [
  "エルフ", "ロイヤル", "ウィッチ", "ドラゴン", "ナイトメア", "ビショップ", "ネメシス",
];


export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassName | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/data/decks").then(r => r.json()).then(setDecks);
  }, []);

  const filtered =
    selectedClass === "all"
      ? decks
      : decks.filter((d) => d.className === selectedClass);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">デッキランキング</h1>
        <p className="text-sm text-muted-foreground">
          マスターランク・ローテーション基準のデッキ勝率・使用率ランキング
        </p>
      </div>

      {/* Class Filter */}
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
            onClick={() => setSelectedClass(cls)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              selectedClass === cls
                ? `${CLASS_BG_COLORS[cls]} ${CLASS_TEXT_COLORS[cls]}`
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClassIcon name={cls} size={16} /> {cls}
          </button>
        ))}
      </div>

      {/* Rankings */}
      <div className="space-y-3">
        {filtered.map((deck) => {
          const diff = +(deck.winRate - deck.prevWinRate).toFixed(1);
          const isExpanded = expandedId === deck.id;
          const hasRecipeImage = !!deck.imageUrl;
          const hasCardImages = (deck.keyCardImages ?? []).some(Boolean);

          return (
            <Card key={deck.id} className="bg-card/50 overflow-hidden">
              <CardContent className="p-0">
                <button
                  className="w-full text-left p-4"
                  onClick={() => setExpandedId(isExpanded ? null : deck.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-muted-foreground/30 w-8 text-center leading-none">
                        {deck.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <ClassIcon name={deck.className} size={22} />
                          <span className="font-bold text-base">{deck.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {deck.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{deck.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-bold text-emerald-400">{deck.winRate}%</p>
                        <p className="text-xs text-muted-foreground">勝率</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-base font-semibold">{deck.usageRate}%</p>
                        <p className="text-xs text-muted-foreground">使用率</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-muted-foreground" />
                      ) : (
                        <ChevronDown size={16} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 sm:hidden text-sm">
                    <span className="text-emerald-400 font-bold">勝率 {deck.winRate}%</span>
                    <span className="text-muted-foreground">使用率 {deck.usageRate}%</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/40 bg-black/20">
                    {/* Deck recipe image */}
                    {hasRecipeImage && (
                      <div className="px-4 pt-4">
                        <p className="text-xs text-muted-foreground mb-2">デッキレシピ</p>
                        <div className="rounded-xl overflow-hidden border border-border/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={deck.imageUrl}
                            alt={`${deck.name} デッキレシピ`}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">難易度</p>
                          <p className="text-amber-400">{DIFFICULTY_LABELS[deck.difficulty]}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">コスト</p>
                          <p>{COST_LABELS[deck.costLevel]}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">サンプル数</p>
                          <p>{deck.sampleCount.toLocaleString()}戦</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">前週比 (勝率)</p>
                          <p className={diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-slate-400"}>
                            {diff > 0 ? "+" : ""}{diff}%
                          </p>
                        </div>
                      </div>

                      {/* Strategy */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">戦略</p>
                        <p className="text-sm leading-relaxed">{deck.strategy}</p>
                      </div>

                      {/* Key cards — image grid if available, text chips as fallback */}
                      {deck.keyCards.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">キーカード</p>
                          {hasCardImages ? (
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                              {deck.keyCards.map((card, i) => {
                                const imgUrl = (deck.keyCardImages ?? [])[i];
                                return imgUrl ? (
                                  <div key={card} className="flex flex-col items-center gap-1">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={imgUrl}
                                      alt={card}
                                      className="w-full aspect-[2/3] object-cover rounded-lg border border-border/50"
                                    />
                                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{card}</span>
                                  </div>
                                ) : (
                                  <span
                                    key={card}
                                    className="text-xs bg-secondary border border-border rounded-md px-2 py-1 text-center"
                                  >
                                    {card}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {deck.keyCards.map((card) => (
                                <span
                                  key={card}
                                  className="text-xs bg-secondary border border-border rounded-md px-2 py-1"
                                >
                                  {card}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && decks.length > 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>このクラスのデッキデータはまだありません</p>
          </div>
        )}

        {decks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>読み込み中...</p>
          </div>
        )}
      </div>
    </div>
  );
}
