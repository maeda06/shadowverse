import Link from "next/link";
import { BarChart2, Layers, Calendar, Play, Star, LogOut } from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "ダッシュボード", icon: BarChart2, exact: true },
  { href: "/admin/meta", label: "週次メタ統計", icon: BarChart2 },
  { href: "/admin/decks", label: "デッキ管理", icon: Layers },
  { href: "/admin/events", label: "イベント管理", icon: Calendar },
  { href: "/admin/videos", label: "動画管理", icon: Play },
  { href: "/admin/cards", label: "カード評価管理", icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <p className="font-bold text-amber-400">SV-META.gg</p>
          <p className="text-xs text-muted-foreground mt-0.5">管理ダッシュボード</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-full"
            >
              <LogOut size={15} /> ログアウト
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
