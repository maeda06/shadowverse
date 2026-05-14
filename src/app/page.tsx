import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Calendar, Play, BookOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getWeeklyMeta,
  getDecks,
  getEvents,
  getVideos,
  getGuides,
  getCardEvaluations,
} from "@/lib/data-store";
import { CLASS_ICONS, CLASS_TEXT_COLORS, CLASS_BG_COLORS } from "@/lib/class-colors";
import type { ClassStats } from "@/lib/types";

function TrendBadge({ current, prev }: { current: number; prev: number }) {
  const diff = +(current - prev).toFixed(1);
  if (diff > 0.3)
    return (
      <span className="flex items-center gap-0.5 text-xs text-emerald-400">
        <TrendingUp size={12} /> +{diff}%
      </span>
    );
  if (diff < -0.3)
    return (
      <span className="flex items-center gap-0.5 text-xs text-red-400">
        <TrendingDown size={12} /> {diff}%
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-xs text-slate-500">
      <Minus size={12} /> {diff >= 0 ? "+" : ""}
      {diff}%
    </span>
  );
}

function ClassStatCard({ stat }: { stat: ClassStats }) {
  return (
    <div className={`rounded-lg border ${CLASS_BG_COLORS[stat.className]} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{CLASS_ICONS[stat.className]}</span>
          <span className={`text-sm font-semibold ${CLASS_TEXT_COLORS[stat.className]}`}>
            {stat.className}
          </span>
        </div>
        <Badge variant="outline" className="text-xs px-1.5 py-0">
          Tier {stat.tier}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">使用率</p>
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm">{stat.usageRate}%</span>
            <TrendBadge current={stat.usageRate} prev={stat.prevUsageRate} />
          </div>
        </div>
        <div>
          <p className="text-muted-foreground">勝率</p>
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm">{stat.winRate}%</span>
            <TrendBadge current={stat.winRate} prev={stat.prevWinRate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [CURRENT_WEEK, allDecks, allEvents, allVideos, allGuides, allCards] = await Promise.all([
    getWeeklyMeta(),
    getDecks(),
    getEvents(),
    getVideos(),
    getGuides(),
    getCardEvaluations(),
  ]);
  const top3Decks = allDecks.slice(0, 3);
  const ongoingEvents = allEvents.filter((e) => e.status === "ongoing");
  const upcomingEvents = allEvents.filter((e) => e.status === "upcoming").slice(0, 2);
  const featuredVideos = allVideos.filter((v) => v.isCurated).slice(0, 3);
  const latestGuides = allGuides.slice(0, 3);
  const topCards = allCards.filter((c) => c.rating === "S" || c.rating === "A").slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">
      {/* Hero */}
      <section>
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-background p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Week {CURRENT_WEEK.weekNumber} ({CURRENT_WEEK.weekStart} 〜 {CURRENT_WEEK.weekEnd})
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-400">週次メタ分析</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">{CURRENT_WEEK.summary}</p>
            </div>
            <div className="flex gap-3 text-center">
              <div className="bg-black/30 rounded-lg px-4 py-3">
                <p className="text-2xl font-bold text-foreground">
                  {CURRENT_WEEK.totalGames.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">集計試合数</p>
              </div>
              <div className="bg-black/30 rounded-lg px-4 py-3">
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground mt-0.5">クラス分析</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {CURRENT_WEEK.classStats.slice(0, 4).map((stat) => (
              <ClassStatCard key={stat.className} stat={stat} />
            ))}
          </div>

          <Link
            href="/meta"
            className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            全クラスの詳細分析を見る <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deck Rankings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">今週のおすすめデッキ</h2>
            <Link href="/decks" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              全て見る <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {top3Decks.map((deck) => (
              <Link key={deck.id} href="/decks">
                <Card className="hover:border-amber-500/30 transition-colors cursor-pointer bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-muted-foreground/40 w-8 text-center">
                          {deck.rank}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-lg">{CLASS_ICONS[deck.className]}</span>
                            <span className="font-semibold">{deck.name}</span>
                            {deck.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs px-1.5 py-0 hidden sm:inline-flex"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">{deck.description}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm shrink-0">
                        <p className="font-bold text-emerald-400">{deck.winRate}%</p>
                        <p className="text-xs text-muted-foreground">勝率</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={18} className="text-amber-400" /> イベント情報
            </h2>
            <Link href="/events" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              全て <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {[...ongoingEvents, ...upcomingEvents].map((event) => (
              <Card key={event.id} className="bg-card/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                        event.status === "ongoing"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {event.status === "ongoing" ? "● 開催中" : "○ 予定"}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">〜 {event.endDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Videos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Play size={18} className="text-red-400" /> 今週のおすすめ動画
          </h2>
          <Link href="/videos" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
            全て見る <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredVideos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="hover:border-red-500/30 transition-colors cursor-pointer bg-card/50 overflow-hidden">
                <div className="aspect-video bg-slate-800 relative">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {Math.floor(video.durationSec / 60)}:{String(video.durationSec % 60).padStart(2, "0")}
                  </div>
                </div>
                <CardContent className="p-3">
                  {video.classTags.length > 0 && (
                    <div className="flex gap-1 mb-1">
                      {video.classTags.map((cls) => (
                        <span key={cls} className={`text-xs ${CLASS_TEXT_COLORS[cls]}`}>
                          {CLASS_ICONS[cls]} {cls}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm font-medium line-clamp-2 leading-snug">{video.title}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{video.channelName}</span>
                    <span>👁 {(video.viewCount / 10000).toFixed(1)}万</span>
                  </div>
                  {video.curationNote && (
                    <p className="text-xs text-amber-400/80 mt-1.5 border-l-2 border-amber-400/40 pl-2 leading-relaxed">
                      {video.curationNote}
                    </p>
                  )}
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Guides + Card Evaluations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen size={18} className="text-blue-400" /> 攻略ガイド
            </h2>
            <Link href="/guides" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              全て見る <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {latestGuides.map((guide) => (
              <Link key={guide.id} href="/guides">
                <Card className="hover:border-blue-500/30 transition-colors cursor-pointer bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          {guide.className && (
                            <span className="text-sm">{CLASS_ICONS[guide.className]}</span>
                          )}
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {guide.category === "beginner" && "初心者"}
                            {guide.category === "class" && "クラスガイド"}
                            {guide.category === "budget" && "コスパ"}
                            {guide.category === "advanced" && "上級者"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{guide.title}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{guide.readMinutes}分</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Star size={18} className="text-amber-400" /> 注目カード評価
            </h2>
            <Link href="/cards" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              全て見る <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {topCards.map((card) => (
              <Link key={card.id} href="/cards">
                <Card className="hover:border-amber-500/30 transition-colors cursor-pointer bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{CLASS_ICONS[card.className]}</span>
                        <div>
                          <p className="text-sm font-medium">{card.cardName}</p>
                          <p className="text-xs text-muted-foreground">
                            {card.className} / {card.rarity} / {card.cost}PP
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-lg font-black ${
                          card.rating === "S"
                            ? "text-red-400"
                            : card.rating === "A"
                            ? "text-amber-400"
                            : "text-blue-400"
                        }`}
                      >
                        {card.rating}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{card.summary}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
