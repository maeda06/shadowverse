"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { CLASS_ICONS } from "@/lib/class-colors";
import type { Deck, ClassName } from "@/lib/types";

const ALL_CLASSES: ClassName[] = [
  "エルフ", "ロイヤル", "ウィッチ", "ドラゴン",
  "ナイトメア", "ビショップ", "ネメシス",
];

const ARCHETYPES = ["Aggro", "Midrange", "Control", "Combo", "OTK"];

function newDeck(): Deck {
  return {
    id: `deck-${Date.now()}`,
    name: "",
    className: "ドラゴン",
    archetype: "Midrange",
    rank: 99,
    winRate: 50,
    usageRate: 0,
    prevWinRate: 50,
    difficulty: 3,
    costLevel: 3,
    tags: [],
    description: "",
    strategy: "",
    keyCards: [],
    deckCode: "",
    sampleCount: 0,
  };
}

export default function AdminDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/decks").then(r => r.json()).then(setDecks);
  }, []);

  function update<K extends keyof Deck>(id: string, field: K, value: Deck[K]) {
    setDecks(decks.map(d => d.id === id ? { ...d, [field]: value } : d));
  }

  function addDeck() {
    setDecks([newDeck(), ...decks]);
  }

  function removeDeck(id: string) {
    if (!confirm("このデッキを削除しますか？")) return;
    setDecks(decks.filter(d => d.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(decks),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">デッキ管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{decks.length}件のデッキ</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addDeck}
            className="flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors"
          >
            <Plus size={14} /> 追加
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-300 transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? "保存しました！" : "保存する"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {decks.map(deck => (
          <div key={deck.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select
                  value={deck.className}
                  onChange={e => update(deck.id, "className", e.target.value as ClassName)}
                  className="text-xs px-2 py-1 rounded-full border border-border bg-secondary focus:outline-none"
                >
                  {ALL_CLASSES.map(cls => (
                    <option key={cls} value={cls}>{CLASS_ICONS[cls]} {cls}</option>
                  ))}
                </select>
                <select
                  value={deck.archetype}
                  onChange={e => update(deck.id, "archetype", e.target.value)}
                  className="text-xs px-2 py-1 rounded-full border border-border bg-secondary focus:outline-none"
                >
                  {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <button onClick={() => removeDeck(deck.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid gap-3">
              <input
                type="text"
                placeholder="デッキ名"
                value={deck.name}
                onChange={e => update(deck.id, "name", e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-medium"
              />
              <textarea
                placeholder="デッキ説明（一言コメント）"
                value={deck.description}
                onChange={e => update(deck.id, "description", e.target.value)}
                rows={2}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
              />
              <textarea
                placeholder="戦略・立ち回り"
                value={deck.strategy}
                onChange={e => update(deck.id, "strategy", e.target.value)}
                rows={2}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">ランク</label>
                <input type="number" min={1} value={deck.rank}
                  onChange={e => update(deck.id, "rank", +e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">勝率 (%)</label>
                <input type="number" min={0} max={100} step={0.1} value={deck.winRate}
                  onChange={e => update(deck.id, "winRate", +e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">使用率 (%)</label>
                <input type="number" min={0} max={100} step={0.1} value={deck.usageRate}
                  onChange={e => update(deck.id, "usageRate", +e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">前週勝率 (%)</label>
                <input type="number" min={0} max={100} step={0.1} value={deck.prevWinRate}
                  onChange={e => update(deck.id, "prevWinRate", +e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">難易度 (1〜5)</label>
                <input type="number" min={1} max={5} value={deck.difficulty}
                  onChange={e => update(deck.id, "difficulty", +e.target.value as Deck["difficulty"])}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">コスト (1〜5)</label>
                <input type="number" min={1} max={5} value={deck.costLevel}
                  onChange={e => update(deck.id, "costLevel", +e.target.value as Deck["costLevel"])}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">サンプル数</label>
                <input type="number" min={0} value={deck.sampleCount}
                  onChange={e => update(deck.id, "sampleCount", +e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">デッキコード</label>
                <input type="text" placeholder="SVWB-X000-2026" value={deck.deckCode}
                  onChange={e => update(deck.id, "deckCode", e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">キーカード（カンマ区切り）</label>
                <input
                  type="text"
                  placeholder="カード名A, カード名B, ..."
                  value={deck.keyCards.join(", ")}
                  onChange={e => update(deck.id, "keyCards", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">タグ（カンマ区切り）</label>
                <input
                  type="text"
                  placeholder="初心者向け, 大会実績あり, ..."
                  value={deck.tags.join(", ")}
                  onChange={e => update(deck.id, "tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>
            </div>
          </div>
        ))}

        {decks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
            <p className="mb-3">デッキがまだ登録されていません</p>
            <button onClick={addDeck} className="text-sm text-amber-400 hover:text-amber-300">
              + 最初のデッキを追加する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
