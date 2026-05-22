"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Save, RefreshCw, Upload, FileDown, FileUp, AlertCircle, CheckCircle2, X } from "lucide-react";
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
    keyCardImages: [],
    sampleCount: 0,
    imageUrl: "",
  };
}

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  const { url } = await res.json();
  return url;
}

type ImportState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "preview"; decks: Deck[]; mode: "add" | "replace" }
  | { status: "error"; message: string };

export default function AdminDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [importState, setImportState] = useState<ImportState>({ status: "idle" });

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

  async function handleImageUpload(id: string, file: File, field: "imageUrl" | "keyCardImages", appendIndex?: number) {
    setUploading(u => ({ ...u, [`${id}-${field}-${appendIndex ?? 0}`]: true }));
    try {
      const url = await uploadImage(file);
      if (field === "imageUrl") {
        update(id, "imageUrl", url);
      } else {
        const deck = decks.find(d => d.id === id)!;
        const imgs = [...(deck.keyCardImages ?? [])];
        if (appendIndex !== undefined) imgs[appendIndex] = url;
        else imgs.push(url);
        update(id, "keyCardImages", imgs);
      }
    } catch {
      alert("画像のアップロードに失敗しました");
    } finally {
      setUploading(u => ({ ...u, [`${id}-${field}-${appendIndex ?? 0}`]: false }));
    }
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

  async function handleCSVFile(file: File) {
    setImportState({ status: "loading" });
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/import", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) {
      setImportState({ status: "error", message: json.error ?? "パースエラー" });
      return;
    }
    setImportState({ status: "preview", decks: json.decks, mode: "add" });
  }

  function confirmImport(mode: "add" | "replace") {
    if (importState.status !== "preview") return;
    const imported = importState.decks;
    setDecks(mode === "replace" ? imported : [...decks, ...imported]);
    setImportState({ status: "idle" });
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">デッキ管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{decks.length}件のデッキ</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/admin/import"
            download="deck_template.csv"
            className="flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors"
          >
            <FileDown size={14} /> テンプレート
          </a>
          <label className={`flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors cursor-pointer ${importState.status === "loading" ? "opacity-50 pointer-events-none" : ""}`}>
            {importState.status === "loading" ? <RefreshCw size={14} className="animate-spin" /> : <FileUp size={14} />}
            CSVインポート
            <input type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleCSVFile(f); e.target.value = ""; }} />
          </label>
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

      {/* インポートエラー */}
      {importState.status === "error" && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4 text-sm">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span className="text-red-400">{importState.message}</span>
          <button onClick={() => setImportState({ status: "idle" })} className="ml-auto text-muted-foreground hover:text-foreground"><X size={14} /></button>
        </div>
      )}

      {/* インポートプレビューモーダル */}
      {importState.status === "preview" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 size={20} className="text-amber-400" />
              <h2 className="text-base font-semibold">インポート確認</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              <span className="text-foreground font-medium">{importState.decks.length}件</span>のデッキを読み込みました。
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 mb-5 max-h-40 overflow-y-auto bg-secondary rounded-lg p-3">
              {importState.decks.map((d, i) => (
                <li key={i}>{d.rank}位 {d.name} ({d.className})</li>
              ))}
            </ul>
            <p className="text-sm font-medium mb-3">既存のデッキをどうしますか？</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => confirmImport("add")}
                className="py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
              >
                既存に追加する
              </button>
              <button
                onClick={() => confirmImport("replace")}
                className="py-2 rounded-lg bg-amber-400 text-black font-semibold text-sm hover:bg-amber-300 transition-colors"
              >
                全て置き換える
              </button>
            </div>
            <button onClick={() => setImportState({ status: "idle" })} className="w-full text-xs text-muted-foreground hover:text-foreground">キャンセル</button>
          </div>
        </div>
      )}

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

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">デッキレシピ画像</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={deck.imageUrl ?? ""}
                    onChange={e => update(deck.id, "imageUrl", e.target.value)}
                    className="flex-1 bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono"
                  />
                  <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border border-border bg-secondary text-xs hover:bg-secondary/80 transition-colors ${uploading[`${deck.id}-imageUrl-0`] ? "opacity-50 pointer-events-none" : ""}`}>
                    {uploading[`${deck.id}-imageUrl-0`] ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
                    アップロード
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(deck.id, f, "imageUrl"); e.target.value = ""; }} />
                  </label>
                  {deck.imageUrl && <img src={deck.imageUrl} alt="" className="w-10 h-10 object-cover rounded border border-border" />}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">キーカード画像（カード名と同順）</label>
                <div className="space-y-1.5">
                  {(deck.keyCardImages ?? []).map((url, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={url}
                        onChange={e => { const imgs = [...(deck.keyCardImages ?? [])]; imgs[i] = e.target.value; update(deck.id, "keyCardImages", imgs); }}
                        className="flex-1 bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono"
                      />
                      <label className={`flex items-center gap-1 cursor-pointer px-2 py-1.5 rounded-lg border border-border bg-secondary text-xs hover:bg-secondary/80 transition-colors ${uploading[`${deck.id}-keyCardImages-${i}`] ? "opacity-50 pointer-events-none" : ""}`}>
                        {uploading[`${deck.id}-keyCardImages-${i}`] ? <RefreshCw size={11} className="animate-spin" /> : <Upload size={11} />}
                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(deck.id, f, "keyCardImages", i); e.target.value = ""; }} />
                      </label>
                      {url && <img src={url} alt="" className="w-8 h-8 object-cover rounded border border-border" />}
                      <button onClick={() => { const imgs = (deck.keyCardImages ?? []).filter((_, j) => j !== i); update(deck.id, "keyCardImages", imgs); }} className="text-muted-foreground hover:text-red-400 text-xs">✕</button>
                    </div>
                  ))}
                  <label className={`inline-flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-amber-400/50 transition-colors ${uploading[`${deck.id}-keyCardImages-add`] ? "opacity-50 pointer-events-none" : ""}`}>
                    {uploading[`${deck.id}-keyCardImages-add`] ? <RefreshCw size={11} className="animate-spin" /> : <Upload size={11} />}
                    キーカード画像を追加
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(deck.id, f, "keyCardImages"); e.target.value = ""; }} />
                  </label>
                </div>
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
