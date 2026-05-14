"use client";

import { useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GUIDES } from "@/lib/mock-data";
import { CLASS_ICONS, CLASS_TEXT_COLORS } from "@/lib/class-colors";

const CATEGORY_LABELS = {
  beginner: { label: "初心者向け", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  class: { label: "クラスガイド", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  budget: { label: "コスパデッキ", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  advanced: { label: "上級者向け", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
};

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  const filtered =
    selectedCategory === "all"
      ? GUIDES
      : GUIDES.filter((g) => g.category === selectedCategory);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">攻略ガイド</h1>
        <p className="text-sm text-muted-foreground">
          初心者から上級者まで役立つ攻略情報をまとめています
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-amber-400 text-black"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          すべて
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(selectedCategory === key ? "all" : key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selectedCategory === key
                ? color
                : "border-transparent bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Guide Cards */}
      <div className="space-y-3">
        {filtered.map((guide) => {
          const cat = CATEGORY_LABELS[guide.category];
          return (
            <Card
              key={guide.id}
              className="hover:border-amber-500/30 transition-colors cursor-pointer bg-card/50"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {guide.className ? (
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
                      {CLASS_ICONS[guide.className]}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      📖
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0 border ${cat.color}`}
                      >
                        {cat.label}
                      </Badge>
                      {guide.className && (
                        <span className={`text-xs ${CLASS_TEXT_COLORS[guide.className]}`}>
                          {guide.className}
                        </span>
                      )}
                      {guide.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-semibold text-base leading-snug mb-1">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guide.summary}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {guide.readMinutes}分で読める
                      </span>
                      <span>最終更新: {guide.updatedAt}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>このカテゴリのガイドはまだありません</p>
        </div>
      )}
    </div>
  );
}
