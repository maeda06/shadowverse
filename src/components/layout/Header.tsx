"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "ホーム", exact: true },
  { href: "/meta", label: "メタデータ" },
  { href: "/decks", label: "デッキランキング" },
  { href: "/meta", label: "対戦データ" },
  { href: "/cards", label: "カード一覧" },
  { href: "/events", label: "ニュース" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070810]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/sv-meta-logo.png" alt="SV-META.gg" width={130} height={36} className="object-contain" />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-0 flex-1">
            {NAV_ITEMS.map(({ href, label, exact }, i) => (
              <Link
                key={`${label}-${i}`}
                href={href}
                className={cn(
                  "px-3.5 py-1 text-sm transition-colors relative whitespace-nowrap",
                  isActive(href, exact)
                    ? "text-amber-400 font-medium"
                    : "text-slate-400 hover:text-slate-100"
                )}
              >
                {label}
                {isActive(href, exact) && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Last update */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 ml-auto shrink-0">
            <RefreshCw size={11} />
            <span>最終更新: 毎週月曜</span>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-white/5 text-slate-400 ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#070810]/95">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ href, label, exact }, i) => (
              <Link
                key={`${label}-${i}`}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2.5 rounded-md text-sm transition-colors",
                  isActive(href, exact)
                    ? "text-amber-400 bg-amber-400/10"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
