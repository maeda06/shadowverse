"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import type { Event } from "@/lib/types";

const EVENT_TYPES: Event["type"][] = ["grand_prix", "cup", "season", "community", "official"];
const EVENT_TYPE_LABELS: Record<Event["type"], string> = {
  grand_prix: "グランプリ", cup: "カップ戦", season: "シーズン", community: "コミュニティ", official: "公式大会",
};
const STATUS_LABELS: Record<Event["status"], string> = {
  ongoing: "開催中", upcoming: "予定", ended: "終了",
};

function newEvent(): Event {
  return {
    id: `event-${Date.now()}`,
    title: "",
    type: "grand_prix",
    status: "upcoming",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    description: "",
    format: "ローテーション",
    prizePool: "",
    officialUrl: "",
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/events").then(r => r.json()).then(setEvents);
  }, []);

  function update(id: string, field: keyof Event, value: string) {
    setEvents(events.map(e => e.id === id ? { ...e, [field]: value } : e));
  }

  function addEvent() {
    setEvents([newEvent(), ...events]);
  }

  function removeEvent(id: string) {
    if (!confirm("このイベントを削除しますか？")) return;
    setEvents(events.filter(e => e.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">イベント管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{events.length}件のイベント</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addEvent}
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
        {events.map(event => (
          <div key={event.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <select
                  value={event.status}
                  onChange={e => update(event.id, "status", e.target.value)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full border bg-transparent focus:outline-none ${
                    event.status === "ongoing" ? "border-emerald-500 text-emerald-400" :
                    event.status === "upcoming" ? "border-blue-500 text-blue-400" :
                    "border-slate-600 text-slate-400"
                  }`}
                >
                  {(Object.keys(STATUS_LABELS) as Event["status"][]).map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <select
                  value={event.type}
                  onChange={e => update(event.id, "type", e.target.value)}
                  className="text-xs px-2 py-1 rounded-full border border-border bg-secondary focus:outline-none"
                >
                  {EVENT_TYPES.map(t => (
                    <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => removeEvent(event.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid gap-3">
              <input
                type="text"
                placeholder="イベント名"
                value={event.title}
                onChange={e => update(event.id, "title", e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-medium"
              />
              <textarea
                placeholder="説明"
                value={event.description}
                onChange={e => update(event.id, "description", e.target.value)}
                rows={2}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">開始日</label>
                  <input type="date" value={event.startDate} onChange={e => update(event.id, "startDate", e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">終了日</label>
                  <input type="date" value={event.endDate} onChange={e => update(event.id, "endDate", e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">賞品</label>
                  <input type="text" placeholder="賞品・報酬" value={event.prizePool ?? ""} onChange={e => update(event.id, "prizePool", e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">公式URL</label>
                  <input type="url" placeholder="https://..." value={event.officialUrl ?? ""} onChange={e => update(event.id, "officialUrl", e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
