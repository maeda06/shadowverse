"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VIDEOS } from "@/lib/mock-data";
import { CLASS_ICONS, CLASS_TEXT_COLORS } from "@/lib/class-colors";
import type { ClassName } from "@/lib/types";

const ALL_TAGS = ["デッキ解説", "メタ解説", "初心者向け", "大会", "対戦動画"];
const ALL_CLASSES: ClassName[] = [
  "エルフ", "ロイヤル", "ウィッチ", "ドラゴン", "ネクロマンサー", "ヴァンパイア", "ビショップ", "ネメシス",
];

export default function VideosPage() {
  const [selectedClass, setSelectedClass] = useState<ClassName | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string | "all">("all");
  const [showCuratedOnly, setShowCuratedOnly] = useState(false);

  const filtered = VIDEOS.filter((v) => {
    if (selectedClass !== "all" && !v.classTags.includes(selectedClass)) return false;
    if (selectedTag !== "all" && !v.tags.includes(selectedTag)) return false;
    if (showCuratedOnly && !v.isCurated) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">YouTube動画まとめ</h1>
        <p className="text-sm text-muted-foreground">
          Shadowverse WB関連の厳選動画をまとめています
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">クラス:</span>
          <button
            onClick={() => setSelectedClass("all")}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedClass === "all"
                ? "bg-amber-400 text-black"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            すべて
          </button>
          {ALL_CLASSES.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls === selectedClass ? "all" : cls)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                selectedClass === cls
                  ? `bg-secondary border border-current ${CLASS_TEXT_COLORS[cls]}`
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {CLASS_ICONS[cls]} {cls}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">タグ:</span>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? "all" : tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-amber-400 text-black"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
          <button
            onClick={() => setShowCuratedOnly(!showCuratedOnly)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              showCuratedOnly
                ? "bg-amber-400 text-black"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            ⭐ おすすめのみ
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="hover:border-red-500/30 transition-colors cursor-pointer bg-card/50 overflow-hidden h-full">
              <div className="aspect-video bg-slate-800 relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                  {Math.floor(video.durationSec / 60)}:{String(video.durationSec % 60).padStart(2, "0")}
                </div>
                {video.isCurated && (
                  <div className="absolute top-2 left-2 bg-amber-400/90 text-black text-xs font-bold px-1.5 py-0.5 rounded">
                    ⭐ おすすめ
                  </div>
                )}
              </div>
              <CardContent className="p-3 flex flex-col gap-2">
                <div className="flex flex-wrap gap-1">
                  {video.classTags.map((cls) => (
                    <span key={cls} className={`text-xs ${CLASS_TEXT_COLORS[cls]}`}>
                      {CLASS_ICONS[cls]} {cls}
                    </span>
                  ))}
                  {video.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm font-medium line-clamp-2 leading-snug flex-1">{video.title}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{video.channelName}</span>
                  <span>👁 {(video.viewCount / 10000).toFixed(1)}万</span>
                </div>
                {video.curationNote && (
                  <p className="text-xs text-amber-400/80 border-l-2 border-amber-400/40 pl-2 leading-relaxed">
                    {video.curationNote}
                  </p>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>条件に一致する動画が見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
