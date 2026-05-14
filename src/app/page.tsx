import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown } from "lucide-react";
import { getWeeklyMeta, getDecks } from "@/lib/data-store";
import { PREV_WEEKS_WINRATE } from "@/lib/mock-data";
import { CLASS_TEXT_COLORS, CLASS_ART_PATHS } from "@/lib/class-colors";
import { ClassIcon } from "@/components/ClassIcon";
import { TrendChart } from "@/components/meta/TrendChart";
import { UsagePieChart } from "@/components/meta/UsagePieChart";
import { DeckCard } from "@/components/DeckCard";
import type { ClassName } from "@/lib/types";

const TREND_CLASSES: ClassName[] = ["ドラゴン", "ナイトメア", "ウィッチ", "ロイヤル", "エルフ"];

const TIER_BADGE: Record<string, string> = {
  S: "bg-amber-400 text-black",
  A: "bg-blue-600 text-white",
  B: "bg-slate-600 text-white",
  C: "bg-slate-700 text-slate-300",
};

export default async function HomePage() {
  const [meta, allDecks] = await Promise.all([getWeeklyMeta(), getDecks()]);
  const { classStats, totalGames, summary } = meta;
  const sorted = [...classStats].sort((a, b) => b.winRate - a.winRate);
  const topClass = sorted[0];
  const top3Decks = allDecks.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#070810]">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-5">

        {/* ── Hero Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left: Best Class */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-[#0d0e1a] min-h-[300px] flex flex-col">
            {/* Class art - right side */}
            <div className="absolute right-0 top-0 bottom-0 w-[50%]">
              <Image
                src={CLASS_ART_PATHS[topClass.className]}
                alt={topClass.className}
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e1a] via-[#0d0e1a]/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col gap-4 flex-1 max-w-[65%]">
              <div>
                <p className="text-xs text-slate-400 mb-1">今週の最強クラス</p>
                <h1 className={`text-5xl font-black leading-none ${CLASS_TEXT_COLORS[topClass.className]}`}>
                  {topClass.className}
                </h1>
              </div>

              <div className="flex items-end gap-8">
                <div>
                  <p className="text-xs text-slate-400 mb-1">勝率</p>
                  <p className="text-4xl font-black text-amber-400">{topClass.winRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">環境適応度</p>
                  <p className="text-4xl font-black text-white">{topClass.tier}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/25 rounded-xl px-3 py-2.5">
                <Crown size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-200/80 leading-relaxed line-clamp-2">{summary}</p>
              </div>

              <div className="mt-auto">
                <Link
                  href="/decks"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  おすすめデッキを見る <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Class Ranking */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0e1a] p-5 flex flex-col">
            <h2 className="text-base font-bold mb-4">クラス勝率ランキング</h2>
            <table className="w-full flex-1">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/5">
                  <th className="text-left pb-3 pr-3 font-normal w-12">Tier</th>
                  <th className="text-left pb-3 font-normal">クラス</th>
                  <th className="text-right pb-3 font-normal">勝率</th>
                  <th className="text-right pb-3 pl-4 font-normal w-20">環境適応度</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(stat => (
                  <tr key={stat.className} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-3">
                      <span className={`text-xs font-black px-2 py-0.5 rounded ${TIER_BADGE[stat.tier]}`}>
                        {stat.tier}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <ClassIcon name={stat.className} size={20} />
                        <span className="text-sm">{stat.className}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`text-sm font-bold ${stat.winRate >= 52 ? "text-amber-400" : stat.winRate >= 50 ? "text-white" : "text-slate-400"}`}>
                        {stat.winRate}%
                      </span>
                    </td>
                    <td className="py-3 text-right pl-4">
                      <span className={`text-sm font-black ${stat.tier === "S" ? "text-amber-400" : stat.tier === "A" ? "text-blue-400" : "text-slate-500"}`}>
                        {stat.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex justify-end">
              <Link href="/meta" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                すべてのクラスを見る <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#0d0e1a] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">
                勝率の推移
                <span className="text-xs text-slate-500 font-normal ml-1">（近過4週間）</span>
              </h2>
              <Link href="/meta" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                すべての推移を表示 <ArrowRight size={12} />
              </Link>
            </div>
            <TrendChart data={PREV_WEEKS_WINRATE} classes={TREND_CLASSES} domain={[40, 65]} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0e1a] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">
                クラス使用率
                <span className="text-xs text-slate-500 font-normal ml-1">（今週）</span>
              </h2>
              <Link href="/meta" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                過去の使用率を表示 <ArrowRight size={12} />
              </Link>
            </div>
            <UsagePieChart data={classStats} totalGames={totalGames} />
          </div>
        </div>

        {/* ── Deck Recommendations ── */}
        <div>
          <h2 className="text-xl font-bold mb-4">今週のおすすめデッキ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3Decks.map((deck, i) => (
              <DeckCard key={deck.id} deck={deck} rank={i + 1} />
            ))}
          </div>
        </div>

        {/* ── AI Meta Report ── */}
        <div className="rounded-2xl border border-violet-500/20 bg-[#0d0e1a] p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-violet-400 text-sm font-black">AI</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">AIメタ分析レポート</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{summary}</p>
              <div className="mt-3">
                <Link href="/meta" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 w-fit">
                  レポートの続きを見る <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
