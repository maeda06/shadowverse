"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { CLASS_ICONS } from "@/lib/class-colors";
import type { Video, ClassName } from "@/lib/types";

const ALL_CLASSES: ClassName[] = [
  "エルフ", "ロイヤル", "ウィッチ", "ドラゴン",
  "ネクロマンサー", "ヴァンパイア", "ビショップ", "ネメシス",
];

function newVideo(): Video {
  return {
    id: `video-${Date.now()}`,
    youtubeId: "",
    title: "",
    channelName: "",
    thumbnailUrl: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    viewCount: 0,
    durationSec: 0,
    classTags: [],
    tags: [],
    isCurated: false,
    curationNote: "",
  };
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/videos").then(r => r.json()).then(setVideos);
  }, []);

  function update(id: string, field: keyof Video, value: unknown) {
    setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
  }

  function toggleClassTag(id: string, cls: ClassName) {
    const video = videos.find(v => v.id === id);
    if (!video) return;
    const tags = video.classTags.includes(cls)
      ? video.classTags.filter(t => t !== cls)
      : [...video.classTags, cls];
    update(id, "classTags", tags);
  }

  function onYoutubeIdChange(id: string, youtubeId: string) {
    update(id, "youtubeId", youtubeId);
    if (youtubeId.length === 11) {
      update(id, "thumbnailUrl", `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`);
    }
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(videos),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">動画管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{videos.length}件の動画</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setVideos([newVideo(), ...videos])}
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
        {videos.map(video => (
          <div key={video.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-4">
              {video.thumbnailUrl && (
                <img src={video.thumbnailUrl} alt="" className="w-32 rounded-lg object-cover aspect-video shrink-0 bg-secondary" />
              )}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">YouTube動画ID（URLの末尾11文字）</label>
                      <input type="text" placeholder="dQw4w9WgXcQ" value={video.youtubeId}
                        onChange={e => onYoutubeIdChange(video.id, e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                    </div>
                    <input type="text" placeholder="動画タイトル" value={video.title}
                      onChange={e => update(video.id, "title", e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="チャンネル名" value={video.channelName}
                        onChange={e => update(video.id, "channelName", e.target.value)}
                        className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                      <input type="number" placeholder="再生数" value={video.viewCount}
                        onChange={e => update(video.id, "viewCount", +e.target.value)}
                        className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                    </div>
                  </div>
                  <button onClick={() => setVideos(videos.filter(v => v.id !== video.id))} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">関連クラス</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_CLASSES.map(cls => (
                      <button key={cls} onClick={() => toggleClassTag(video.id, cls)}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          video.classTags.includes(cls) ? "bg-amber-400/20 text-amber-400 border border-amber-400/40" : "bg-secondary text-muted-foreground border border-border"
                        }`}>
                        {CLASS_ICONS[cls]} {cls}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={video.isCurated} onChange={e => update(video.id, "isCurated", e.target.checked)}
                      className="rounded" />
                    おすすめ（⭐キュレーション）
                  </label>
                </div>
                {video.isCurated && (
                  <textarea placeholder="おすすめコメント（サイトに表示されます）" value={video.curationNote ?? ""}
                    onChange={e => update(video.id, "curationNote", e.target.value)} rows={2}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
