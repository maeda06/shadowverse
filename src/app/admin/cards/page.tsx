"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { CLASS_ICONS } from "@/lib/class-colors";
import type { CardEvaluation, ClassName } from "@/lib/types";

const ALL_CLASSES: ClassName[] = [
  "エルフ", "ロイヤル", "ウィッチ", "ドラゴン",
  "ネクロマンサー", "ヴァンパイア", "ビショップ", "ネメシス",
];
const RATINGS = ["S", "A", "B", "C", "D"] as const;
const RARITIES = ["Legendary", "Gold", "Silver", "Bronze"] as const;

function newCard(): CardEvaluation {
  return {
    id: `card-${Date.now()}`,
    cardName: "",
    className: "ドラゴン",
    rarity: "Gold",
    cost: 3,
    setName: "",
    rating: "B",
    publishedAt: new Date().toISOString().slice(0, 10),
    summary: "",
    description: "",
  };
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardEvaluation[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/cards").then(r => r.json()).then(setCards);
  }, []);

  function update(id: string, field: keyof CardEvaluation, value: unknown) {
    setCards(cards.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cards),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  }

  const RATING_COLORS = { S: "text-red-400 border-red-600", A: "text-amber-400 border-amber-600", B: "text-blue-400 border-blue-600", C: "text-slate-400 border-slate-600", D: "text-slate-500 border-slate-700" };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">カード評価管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{cards.length}件</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCards([newCard(), ...cards])}
            className="flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors">
            <Plus size={14} /> 追加
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-300 transition-colors disabled:opacity-50">
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? "保存しました！" : "保存する"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {cards.map(card => (
          <div key={card.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-black shrink-0 ${RATING_COLORS[card.rating]}`}>
                {card.rating}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2 items-center">
                  <select value={card.rating} onChange={e => update(card.id, "rating", e.target.value)}
                    className="bg-secondary border border-border rounded px-2 py-1 text-sm focus:outline-none">
                    {RATINGS.map(r => <option key={r} value={r}>評価: {r}</option>)}
                  </select>
                  <select value={card.className} onChange={e => update(card.id, "className", e.target.value as ClassName)}
                    className="bg-secondary border border-border rounded px-2 py-1 text-sm focus:outline-none">
                    {ALL_CLASSES.map(cls => <option key={cls} value={cls}>{CLASS_ICONS[cls]} {cls}</option>)}
                  </select>
                  <select value={card.rarity} onChange={e => update(card.id, "rarity", e.target.value)}
                    className="bg-secondary border border-border rounded px-2 py-1 text-sm focus:outline-none">
                    {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <input type="number" placeholder="PP" value={card.cost} onChange={e => update(card.id, "cost", +e.target.value)}
                    className="w-16 bg-secondary border border-border rounded px-2 py-1 text-sm focus:outline-none" min={0} max={20} />
                  <button onClick={() => setCards(cards.filter(c => c.id !== card.id))} className="ml-auto text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="カード名" value={card.cardName} onChange={e => update(card.id, "cardName", e.target.value)}
                    className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-medium" />
                  <input type="text" placeholder="セット名（例: 覚醒の神々）" value={card.setName} onChange={e => update(card.id, "setName", e.target.value)}
                    className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <input type="text" placeholder="一言評価（リストに表示）" value={card.summary} onChange={e => update(card.id, "summary", e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                <textarea placeholder="詳細評価（クリックで展開表示）" value={card.description} onChange={e => update(card.id, "description", e.target.value)}
                  rows={2} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
