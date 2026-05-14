import { requireAdmin } from "@/lib/admin-auth";
import { getWeeklyMeta, getDecks, getEvents, getVideos, getCardEvaluations } from "@/lib/data-store";
import Link from "next/link";
import { BarChart2, Layers, Calendar, Play, Star, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  await requireAdmin();

  const [meta, decks, events, videos, cards] = await Promise.all([
    getWeeklyMeta(),
    getDecks(),
    getEvents(),
    getVideos(),
    getCardEvaluations(),
  ]);

  const stats = [
    { label: "週次メタ統計", value: `Week ${meta.weekNumber}`, href: "/admin/meta", icon: BarChart2, color: "text-amber-400" },
    { label: "デッキ", value: `${decks.length}件`, href: "/admin/decks", icon: Layers, color: "text-blue-400" },
    { label: "イベント", value: `${events.length}件 (開催中 ${events.filter(e => e.status === "ongoing").length})`, href: "/admin/events", icon: Calendar, color: "text-emerald-400" },
    { label: "動画", value: `${videos.length}件`, href: "/admin/videos", icon: Play, color: "text-red-400" },
    { label: "カード評価", value: `${cards.length}件`, href: "/admin/cards", icon: Star, color: "text-purple-400" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold">ダッシュボード</h1>
        <p className="text-sm text-muted-foreground mt-1">
          現在のデータ状況: Week {meta.weekNumber} ({meta.weekStart} 〜 {meta.weekEnd})
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-card border border-border rounded-xl p-5 hover:border-amber-500/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon size={18} className={color} />
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold mb-3">クイックアクション</h2>
        <div className="space-y-2">
          <Link href="/admin/meta" className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
            <BarChart2 size={14} /> 今週のメタ統計を更新する →
          </Link>
          <Link href="/admin/events" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <Calendar size={14} /> 新しいイベントを追加する →
          </Link>
          <Link href="/admin/videos" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <Play size={14} /> 動画を追加する →
          </Link>
          <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ↗ サイトを確認する（別タブで開く）
          </Link>
        </div>
      </div>
    </div>
  );
}
