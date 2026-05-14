export type ClassName =
  | "エルフ"
  | "ロイヤル"
  | "ウィッチ"
  | "ドラゴン"
  | "ネクロマンサー"
  | "ヴァンパイア"
  | "ビショップ"
  | "ネメシス";

export type Tier = "S" | "A" | "B" | "C";

export type Format = "ローテーション" | "アンリミテッド";

export interface ClassStats {
  className: ClassName;
  usageRate: number;
  winRate: number;
  prevUsageRate: number;
  prevWinRate: number;
  tier: Tier;
}

export interface Deck {
  id: string;
  name: string;
  className: ClassName;
  archetype: string;
  rank: number;
  winRate: number;
  usageRate: number;
  prevWinRate: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  costLevel: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  description: string;
  strategy: string;
  keyCards: string[];
  deckCode: string;
  sampleCount: number;
}

export interface Event {
  id: string;
  title: string;
  type: "grand_prix" | "cup" | "season" | "community" | "official";
  status: "ongoing" | "upcoming" | "ended";
  startDate: string;
  endDate: string;
  description: string;
  format?: Format;
  prizePool?: string;
  officialUrl?: string;
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  durationSec: number;
  classTags: ClassName[];
  tags: string[];
  isCurated: boolean;
  curationNote?: string;
}

export interface CardEvaluation {
  id: string;
  cardName: string;
  className: ClassName;
  rarity: "Bronze" | "Silver" | "Gold" | "Legendary";
  cost: number;
  setName: string;
  rating: "S" | "A" | "B" | "C" | "D";
  publishedAt: string;
  summary: string;
  description: string;
  imageUrl?: string;
}

export interface Guide {
  id: string;
  title: string;
  category: "beginner" | "advanced" | "class" | "budget";
  className?: ClassName;
  publishedAt: string;
  updatedAt: string;
  summary: string;
  readMinutes: number;
  tags: string[];
}

export interface WeeklyMeta {
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  format: Format;
  classStats: ClassStats[];
  totalGames: number;
  summary: string;
}

export interface MatchupData {
  classA: ClassName;
  classB: ClassName;
  winRateA: number;
  sampleCount: number;
}
