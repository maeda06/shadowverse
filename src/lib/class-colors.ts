import type { ClassName } from "./types";

export const CLASS_COLORS: Record<ClassName, string> = {
  エルフ: "#2E7D32",
  ロイヤル: "#1565C0",
  ウィッチ: "#6A1B9A",
  ドラゴン: "#BF360C",
  ネクロマンサー: "#37474F",
  ヴァンパイア: "#880E4F",
  ビショップ: "#F57F17",
  ネメシス: "#00838F",
};

export const CLASS_BG_COLORS: Record<ClassName, string> = {
  エルフ: "bg-emerald-900/40 border-emerald-700",
  ロイヤル: "bg-blue-900/40 border-blue-700",
  ウィッチ: "bg-purple-900/40 border-purple-700",
  ドラゴン: "bg-red-900/40 border-red-700",
  ネクロマンサー: "bg-slate-800/60 border-slate-600",
  ヴァンパイア: "bg-pink-900/40 border-pink-800",
  ビショップ: "bg-amber-900/40 border-amber-700",
  ネメシス: "bg-teal-900/40 border-teal-700",
};

export const CLASS_TEXT_COLORS: Record<ClassName, string> = {
  エルフ: "text-emerald-400",
  ロイヤル: "text-blue-400",
  ウィッチ: "text-purple-400",
  ドラゴン: "text-red-400",
  ネクロマンサー: "text-slate-400",
  ヴァンパイア: "text-pink-400",
  ビショップ: "text-amber-400",
  ネメシス: "text-teal-400",
};

export const CLASS_BADGE_COLORS: Record<ClassName, string> = {
  エルフ: "bg-emerald-800 text-emerald-200 border-emerald-600",
  ロイヤル: "bg-blue-800 text-blue-200 border-blue-600",
  ウィッチ: "bg-purple-800 text-purple-200 border-purple-600",
  ドラゴン: "bg-red-800 text-red-200 border-red-600",
  ネクロマンサー: "bg-slate-700 text-slate-200 border-slate-500",
  ヴァンパイア: "bg-pink-900 text-pink-200 border-pink-700",
  ビショップ: "bg-amber-800 text-amber-200 border-amber-600",
  ネメシス: "bg-teal-800 text-teal-200 border-teal-600",
};

export const CLASS_ICONS: Record<ClassName, string> = {
  エルフ: "🌿",
  ロイヤル: "⚔️",
  ウィッチ: "🔮",
  ドラゴン: "🐉",
  ネクロマンサー: "💀",
  ヴァンパイア: "🦇",
  ビショップ: "✨",
  ネメシス: "⚙️",
};

export const CLASS_SHORT: Record<ClassName, string> = {
  エルフ: "葉",
  ロイヤル: "剣",
  ウィッチ: "魔",
  ドラゴン: "竜",
  ネクロマンサー: "屍",
  ヴァンパイア: "血",
  ビショップ: "法",
  ネメシス: "機",
};
