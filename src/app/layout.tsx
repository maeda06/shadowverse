import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SV-META.gg | Shadowverse WB 週次メタ分析",
  description:
    "Shadowverse World Beyond の最新メタ分析、デッキランキング、イベント情報をまとめてお届け。毎週月曜更新。",
  keywords: "シャドウバース, Shadowverse WB, メタ分析, デッキランキング, 勝率, 使用率",
  openGraph: {
    title: "SV-META.gg | Shadowverse WB 週次メタ分析",
    description: "毎週月曜更新。今週の環境トップデッキと使用率・勝率を徹底分析。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
