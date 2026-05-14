import type { ClassName } from "./types";

export const CLASS_COLORS: Record<ClassName, string> = {
  エルフ: "#2E7D32",
  ロイヤル: "#1565C0",
  ウィッチ: "#6A1B9A",
  ドラゴン: "#BF360C",
  ナイトメア: "#4A148C",
  ビショップ: "#F57F17",
  ネメシス: "#00838F",
};

export const CLASS_BG_COLORS: Record<ClassName, string> = {
  エルフ: "bg-emerald-900/40 border-emerald-700",
  ロイヤル: "bg-blue-900/40 border-blue-700",
  ウィッチ: "bg-purple-900/40 border-purple-700",
  ドラゴン: "bg-red-900/40 border-red-700",
  ナイトメア: "bg-violet-900/40 border-violet-700",
  ビショップ: "bg-amber-900/40 border-amber-700",
  ネメシス: "bg-teal-900/40 border-teal-700",
};

export const CLASS_TEXT_COLORS: Record<ClassName, string> = {
  エルフ: "text-emerald-400",
  ロイヤル: "text-blue-400",
  ウィッチ: "text-purple-400",
  ドラゴン: "text-red-400",
  ナイトメア: "text-violet-400",
  ビショップ: "text-amber-400",
  ネメシス: "text-teal-400",
};

export const CLASS_BADGE_COLORS: Record<ClassName, string> = {
  エルフ: "bg-emerald-800 text-emerald-200 border-emerald-600",
  ロイヤル: "bg-blue-800 text-blue-200 border-blue-600",
  ウィッチ: "bg-purple-800 text-purple-200 border-purple-600",
  ドラゴン: "bg-red-800 text-red-200 border-red-600",
  ナイトメア: "bg-violet-900 text-violet-200 border-violet-700",
  ビショップ: "bg-amber-800 text-amber-200 border-amber-600",
  ネメシス: "bg-teal-800 text-teal-200 border-teal-600",
};

export const CLASS_ICONS: Record<ClassName, string> = {
  エルフ: "🌿",
  ロイヤル: "⚔️",
  ウィッチ: "🔮",
  ドラゴン: "🐉",
  ナイトメア: "🌙",
  ビショップ: "✨",
  ネメシス: "⚙️",
};

export const CLASS_SHORT: Record<ClassName, string> = {
  エルフ: "葉",
  ロイヤル: "剣",
  ウィッチ: "魔",
  ドラゴン: "竜",
  ナイトメア: "夢",
  ビショップ: "法",
  ネメシス: "機",
};
