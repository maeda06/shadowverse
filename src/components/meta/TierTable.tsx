import type { ClassStats } from "@/lib/types";
import { CLASS_ICONS, CLASS_TEXT_COLORS, CLASS_BG_COLORS } from "@/lib/class-colors";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  stats: ClassStats[];
}

const TIER_STYLES = {
  S: { bg: "bg-red-950/60 border-red-700", badge: "bg-red-600 text-white", label: "Tier S" },
  A: { bg: "bg-blue-950/60 border-blue-700", badge: "bg-blue-600 text-white", label: "Tier A" },
  B: { bg: "bg-emerald-950/60 border-emerald-800", badge: "bg-emerald-700 text-white", label: "Tier B" },
  C: { bg: "bg-slate-900/60 border-slate-700", badge: "bg-slate-600 text-white", label: "Tier C" },
};

function TrendIcon({ current, prev }: { current: number; prev: number }) {
  const diff = current - prev;
  if (diff > 0.3) return <TrendingUp size={14} className="text-emerald-400" />;
  if (diff < -0.3) return <TrendingDown size={14} className="text-red-400" />;
  return <Minus size={14} className="text-slate-500" />;
}

export function TierTable({ stats }: Props) {
  const tiers = ["S", "A", "B", "C"] as const;

  return (
    <div className="space-y-3">
      {tiers.map((tier) => {
        const tierStats = stats.filter((s) => s.tier === tier);
        if (!tierStats.length) return null;
        const style = TIER_STYLES[tier];
        return (
          <div key={tier} className={`rounded-lg border ${style.bg} p-3`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${style.badge}`}>{style.label}</span>
              <span className="text-xs text-muted-foreground">
                {tier === "S" && "環境トップ — 積極的に採用推奨"}
                {tier === "A" && "有力クラス — 十分な戦力あり"}
                {tier === "B" && "中堅クラス — 工夫次第で戦える"}
                {tier === "C" && "環境外 — 現状は不利"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tierStats.map((stat) => (
                <div
                  key={stat.className}
                  className="flex items-center justify-between bg-black/20 rounded-md px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CLASS_ICONS[stat.className]}</span>
                    <span className={`text-sm font-medium ${CLASS_TEXT_COLORS[stat.className]}`}>
                      {stat.className}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>使用率 <span className="text-foreground font-semibold">{stat.usageRate}%</span></span>
                    <span>勝率 <span className="text-foreground font-semibold">{stat.winRate}%</span></span>
                    <TrendIcon current={stat.usageRate} prev={stat.prevUsageRate} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
