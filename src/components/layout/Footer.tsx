import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="font-bold text-sm text-amber-400 mb-3">SV-META.gg</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shadowverse World Beyondの週次メタ分析サイト。毎週月曜日に最新の環境情報をお届けします。
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">コンテンツ</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/meta" className="hover:text-foreground transition-colors">メタ分析</Link></li>
              <li><Link href="/decks" className="hover:text-foreground transition-colors">デッキランキング</Link></li>
              <li><Link href="/events" className="hover:text-foreground transition-colors">イベント情報</Link></li>
              <li><Link href="/videos" className="hover:text-foreground transition-colors">動画まとめ</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">攻略情報</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/cards" className="hover:text-foreground transition-colors">カード評価</Link></li>
              <li><Link href="/guides" className="hover:text-foreground transition-colors">攻略ガイド</Link></li>
              <li><Link href="/guides?category=beginner" className="hover:text-foreground transition-colors">初心者ガイド</Link></li>
              <li><Link href="/guides?category=budget" className="hover:text-foreground transition-colors">コスパデッキ</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">サイト情報</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">プライバシーポリシー</span></li>
              <li><span className="cursor-default">お問い合わせ</span></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              当サイトはCygames, Inc.とは無関係の非公式ファンサイトです。
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2026 SV-META.gg All rights reserved.</p>
          <p>Shadowverse is a trademark of Cygames, Inc.</p>
        </div>
      </div>
    </footer>
  );
}
