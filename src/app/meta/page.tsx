"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassUsageChart } from "@/components/meta/ClassUsageChart";
import { WinRateChart } from "@/components/meta/WinRateChart";
import { TierTable } from "@/components/meta/TierTable";
import { TrendChart } from "@/components/meta/TrendChart";
import { CURRENT_WEEK, PREV_WEEKS_USAGE, MATCHUP_DATA } from "@/lib/mock-data";
import { CLASS_ICONS, CLASS_TEXT_COLORS } from "@/lib/class-colors";
import type { ClassName } from "@/lib/types";

const TREND_CLASSES: ClassName[] = ["ドラゴン", "ネクロマンサー", "エルフ", "ウィッチ", "ロイヤル"];

const MATCHUP_CLASSES: ClassName[] = ["ドラゴン", "ネクロマンサー", "エルフ", "ウィッチ", "ロイヤル"];

function getMatchupRate(classA: ClassName, classB: ClassName): number | null {
  if (classA === classB) return null;
  const direct = MATCHUP_DATA.find((m) => m.classA === classA && m.classB === classB);
  if (direct) return direct.winRateA;
  const reverse = MATCHUP_DATA.find((m) => m.classA === classB && m.classB === classA);
  if (reverse) return +(100 - reverse.winRateA).toFixed(0);
  return null;
}

function MatchupCell({ rate }: { rate: number | null }) {
  if (rate === null)
    return <td className="text-center py-2 px-3 text-muted-foreground/30 text-sm">—</td>;
  const bg =
    rate >= 58
      ? "text-emerald-400 font-bold"
      : rate >= 52
      ? "text-emerald-300"
      : rate >= 48
      ? "text-slate-300"
      : rate >= 42
      ? "text-red-300"
      : "text-red-400 font-bold";
  return (
    <td className={`text-center py-2 px-3 text-sm ${bg}`}>{rate}%</td>
  );
}

export default function MetaPage() {
  const { classStats, weekNumber, weekStart, weekEnd, summary, totalGames } = CURRENT_WEEK;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Week {weekNumber} ({weekStart} 〜 {weekEnd}) · {totalGames.toLocaleString()}試合分析
        </div>
        <h1 className="text-2xl font-bold mb-2">週次メタ分析</h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{summary}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {classStats.slice(0, 4).map((stat) => {
          const diff = +(stat.usageRate - stat.prevUsageRate).toFixed(1);
          return (
            <Card key={stat.className} className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{CLASS_ICONS[stat.className]}</span>
                  <span className={`text-sm font-semibold ${CLASS_TEXT_COLORS[stat.className]}`}>
                    {stat.className}
                  </span>
                </div>
                <p className="text-2xl font-black">{stat.usageRate}%</p>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {diff > 0 ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp size={12} /> +{diff}%
                    </span>
                  ) : diff < 0 ? (
                    <span className="text-red-400 flex items-center gap-0.5">
                      <TrendingDown size={12} /> {diff}%
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-0.5">
                      <Minus size={12} /> 0%
                    </span>
                  )}
                  <span className="text-muted-foreground">前週比</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">クラス使用率</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassUsageChart data={classStats} />
            <div className="mt-3 space-y-1">
              {classStats.map((stat) => {
                const diff = +(stat.usageRate - stat.prevUsageRate).toFixed(1);
                return (
                  <div key={stat.className} className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      {CLASS_ICONS[stat.className]}
                      <span className={CLASS_TEXT_COLORS[stat.className]}>{stat.className}</span>
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-foreground font-semibold">{stat.usageRate}%</span>
                      <span className={diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-slate-500"}>
                        {diff > 0 ? "+" : ""}{diff}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">クラス勝率</CardTitle>
          </CardHeader>
          <CardContent>
            <WinRateChart data={classStats} />
            <div className="mt-3 space-y-1">
              {classStats.map((stat) => {
                const diff = +(stat.winRate - stat.prevWinRate).toFixed(1);
                return (
                  <div key={stat.className} className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      {CLASS_ICONS[stat.className]}
                      <span className={CLASS_TEXT_COLORS[stat.className]}>{stat.className}</span>
                    </span>
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold ${stat.winRate >= 52 ? "text-emerald-400" : stat.winRate >= 50 ? "text-amber-400" : "text-red-400"}`}>
                        {stat.winRate}%
                      </span>
                      <span className={diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-slate-500"}>
                        {diff > 0 ? "+" : ""}{diff}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Table */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">環境Tier表 — Week {weekNumber}</CardTitle>
          <p className="text-xs text-muted-foreground">マスターランク・ローテーション基準</p>
        </CardHeader>
        <CardContent>
          <TierTable stats={classStats} />
        </CardContent>
      </Card>

      {/* Trend */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">使用率トレンド（過去4週間）</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={PREV_WEEKS_USAGE} classes={TREND_CLASSES} />
        </CardContent>
      </Card>

      {/* Matchup Matrix */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">マッチアップ勝率表</CardTitle>
          <p className="text-xs text-muted-foreground">行クラスの列クラスに対する勝率 / 上位5クラス</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 px-3 text-muted-foreground font-normal text-xs">vs</th>
                  {MATCHUP_CLASSES.map((cls) => (
                    <th key={cls} className="py-2 px-3 text-center text-xs text-muted-foreground font-normal">
                      {CLASS_ICONS[cls]}<br />
                      <span className={CLASS_TEXT_COLORS[cls]}>{cls.slice(0, 3)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATCHUP_CLASSES.map((rowClass) => (
                  <tr key={rowClass} className="border-t border-border/40">
                    <td className="py-2 px-3 text-xs font-medium">
                      <span className="flex items-center gap-1">
                        {CLASS_ICONS[rowClass]}
                        <span className={CLASS_TEXT_COLORS[rowClass]}>{rowClass.slice(0, 4)}</span>
                      </span>
                    </td>
                    {MATCHUP_CLASSES.map((colClass) => (
                      <MatchupCell key={colClass} rate={getMatchupRate(rowClass, colClass)} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="text-emerald-400 font-bold">60%+</span> 有利</span>
            <span className="flex items-center gap-1"><span className="text-emerald-300">52-59%</span> やや有利</span>
            <span className="flex items-center gap-1"><span className="text-slate-300">48-51%</span> ほぼ互角</span>
            <span className="flex items-center gap-1"><span className="text-red-400 font-bold">〜41%</span> 不利</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
