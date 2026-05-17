"use client";

import Link from "next/link";
import Image from "next/image";
import { ClassIcon } from "@/components/ClassIcon";
import { CLASS_TEXT_COLORS, CLASS_BG_COLORS, CLASS_ART_PATHS } from "@/lib/class-colors";
import type { Deck } from "@/lib/types";

interface Props {
  deck: Deck;
  rank: number;
}

export function DeckCard({ deck, rank }: Props) {
  const envAdapt = deck.winRate >= 53 ? "S" : deck.winRate >= 51 ? "A" : "B";
  const envColor = envAdapt === "S" ? "text-amber-400" : envAdapt === "A" ? "text-blue-400" : "text-slate-400";
  const rankBg = rank === 1 ? "bg-amber-400 text-black" : rank === 2 ? "bg-slate-300 text-black" : "bg-amber-800 text-white";

  return (
    <div className={`rounded-2xl overflow-hidden border ${rank === 1 ? "border-amber-500/50" : "border-white/10"} bg-[#0d0e1a] flex flex-col`}>
      {/* Artwork */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={CLASS_ART_PATHS[deck.className]}
          alt={deck.className}
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e1a] via-[#0d0e1a]/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${rankBg}`}>
            {rank}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CLASS_BG_COLORS[deck.className]} ${CLASS_TEXT_COLORS[deck.className]}`}>
            {deck.className}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="font-bold text-base leading-snug">{deck.name}</h3>

        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">勝率</p>
            <p className="text-xl font-black text-amber-400">{deck.winRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">使用率</p>
            <p className="text-xl font-black">{deck.usageRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">環境適応度</p>
            <p className={`text-xl font-black ${envColor}`}>{envAdapt}</p>
          </div>
        </div>

        {deck.keyCards.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">キーカード</p>
            <div className="flex flex-wrap gap-1">
              {deck.keyCards.slice(0, 4).map(card => (
                <span key={card} className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1">
                  {card}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-1">
          <Link
            href="/decks"
            className="block w-full text-center text-xs border border-white/15 rounded-xl py-2.5 hover:bg-white/5 transition-colors font-medium"
          >
            デッキ詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
