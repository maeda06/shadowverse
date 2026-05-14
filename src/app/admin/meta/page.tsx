"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { CLASS_ICONS } from "@/lib/class-colors";
import type { WeeklyMeta, ClassStats, ClassName, Tier } from "@/lib/types";

const CLASS_NAMES: ClassName[] = [
  "エルフ", "ロイヤル", "ウィッチ", "ドラゴン",
  "ネクロマンサー", "ヴァンパイア", "ビショップ", "ネメシス",
];
const TIERS: Tier[] = ["S", "A", "B", "C"];

export default function AdminMetaPage() {
  const [meta, setMeta] = useState<WeeklyMeta | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/meta").then(r => r.json()).then(setMeta);
  }, []);

  async function handleSave() {
    if (!meta) return;
    setSaving(true);
    const res = await fetch("/api/admin/meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meta),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  function updateClassStat(className: ClassName, field: keyof ClassStats, value: string | number) {
    if (!meta) return;
    setMeta({
      ...meta,
      classStats: meta.classStats.map(s =>
        s.className === className ? { ...s, [field]: value } : s
      ),
    });
  }

  function updateMeta(field: keyof WeeklyMeta, value: string | number) {
    if (!meta) return;
    setMeta({ ...meta, [field]: value });
  }

  if (!meta) return <div className="p-8 text-muted-foreground">読み込み中...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">週次メタ統計の編集</h1>
          <p className="text-sm text-muted-foreground mt-0.5">クラス使用率・勝率・Tier を更新します</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-300 transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "保存しました！" : "保存する"}
        </button>
      </div>

      {/* Week Info */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4">
        <h2 className="font-semibold text-sm">基本情報</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">週番号</label>
            <input
              type="number"
              value={meta.weekNumber}
              onChange={e => updateMeta("weekNumber", +e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">開始日</label>
            <input
              type="date"
              value={meta.weekStart}
              onChange={e => updateMeta("weekStart", e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">終了日</label>
            <input
              type="date"
              value={meta.weekEnd}
              onChange={e => updateMeta("weekEnd", e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
          </div>
          <div className="col-span-2 sm:col-span-3">
            <label className="block text-xs text-muted-foreground mb-1">集計試合数</label>
            <input
              type="number"
              value={meta.totalGames}
              onChange={e => updateMeta("totalGames", +e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
          </div>
          <div className="col-span-2 sm:col-span-3">
            <label className="block text-xs text-muted-foreground mb-1">環境サマリー（トップページ表示文）</label>
            <textarea
              value={meta.summary}
              onChange={e => updateMeta("summary", e.target.value)}
              rows={3}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Class Stats */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">クラス別統計</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left py-2 pr-4 font-normal">クラス</th>
                <th className="text-left py-2 px-2 font-normal">使用率 (%)</th>
                <th className="text-left py-2 px-2 font-normal">勝率 (%)</th>
                <th className="text-left py-2 px-2 font-normal">前週使用率</th>
                <th className="text-left py-2 px-2 font-normal">前週勝率</th>
                <th className="text-left py-2 px-2 font-normal">Tier</th>
              </tr>
            </thead>
            <tbody>
              {CLASS_NAMES.map(cls => {
                const stat = meta.classStats.find(s => s.className === cls) ?? {
                  className: cls, usageRate: 0, winRate: 50, prevUsageRate: 0, prevWinRate: 50, tier: "C" as Tier,
                };
                return (
                  <tr key={cls} className="border-b border-border/40">
                    <td className="py-2 pr-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        {CLASS_ICONS[cls]} {cls}
                      </span>
                    </td>
                    {(["usageRate", "winRate", "prevUsageRate", "prevWinRate"] as const).map(field => (
                      <td key={field} className="py-2 px-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={stat[field]}
                          onChange={e => updateClassStat(cls, field, +e.target.value)}
                          className="w-20 bg-secondary border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-2">
                      <select
                        value={stat.tier}
                        onChange={e => updateClassStat(cls, "tier", e.target.value as Tier)}
                        className="bg-secondary border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                      >
                        {TIERS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
