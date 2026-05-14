import { supabase } from "./supabase";
import {
  CURRENT_WEEK,
  DECK_RANKINGS,
  EVENTS,
  VIDEOS,
  CARD_EVALUATIONS,
  GUIDES,
} from "./mock-data";
import type { WeeklyMeta, Deck, Event, Video, CardEvaluation, Guide } from "./types";

// ---- WeeklyMeta ----
export async function getWeeklyMeta(): Promise<WeeklyMeta> {
  const { data, error } = await supabase
    .from("weekly_meta")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return CURRENT_WEEK;

  return {
    weekStart: data.week_start,
    weekEnd: data.week_end,
    weekNumber: data.week_number,
    format: data.format,
    classStats: data.class_stats,
    totalGames: data.total_games,
    summary: data.summary,
  };
}

export async function saveWeeklyMeta(meta: WeeklyMeta): Promise<void> {
  await supabase.from("weekly_meta").upsert({
    id: 1,
    week_start: meta.weekStart,
    week_end: meta.weekEnd,
    week_number: meta.weekNumber,
    format: meta.format,
    class_stats: meta.classStats,
    total_games: meta.totalGames,
    summary: meta.summary,
    updated_at: new Date().toISOString(),
  });
}

// ---- Decks ----
export async function getDecks(): Promise<Deck[]> {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .order("rank", { ascending: true });

  if (error || !data || data.length === 0) return DECK_RANKINGS;

  return data.map((d) => ({
    id: d.id,
    name: d.name,
    className: d.class_name,
    archetype: d.archetype,
    rank: d.rank,
    winRate: d.win_rate,
    usageRate: d.usage_rate,
    prevWinRate: d.prev_win_rate,
    difficulty: d.difficulty,
    costLevel: d.cost_level,
    tags: d.tags,
    description: d.description,
    strategy: d.strategy,
    keyCards: d.key_cards,
    deckCode: d.deck_code,
    sampleCount: d.sample_count,
  }));
}

export async function saveDecks(decks: Deck[]): Promise<void> {
  await supabase.from("decks").delete().neq("id", "___never___");
  if (decks.length === 0) return;
  await supabase.from("decks").insert(
    decks.map((d) => ({
      id: d.id,
      name: d.name,
      class_name: d.className,
      archetype: d.archetype,
      rank: d.rank,
      win_rate: d.winRate,
      usage_rate: d.usageRate,
      prev_win_rate: d.prevWinRate,
      difficulty: d.difficulty,
      cost_level: d.costLevel,
      tags: d.tags,
      description: d.description,
      strategy: d.strategy,
      key_cards: d.keyCards,
      deck_code: d.deckCode,
      sample_count: d.sampleCount,
    }))
  );
}

// ---- Events ----
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: false });

  if (error || !data || data.length === 0) return EVENTS;

  return data.map((d) => ({
    id: d.id,
    title: d.title,
    type: d.type,
    status: d.status,
    startDate: d.start_date,
    endDate: d.end_date,
    description: d.description,
    format: d.format,
    prizePool: d.prize_pool,
    officialUrl: d.official_url,
  }));
}

export async function saveEvents(events: Event[]): Promise<void> {
  await supabase.from("events").delete().neq("id", "___never___");
  if (events.length === 0) return;
  await supabase.from("events").insert(
    events.map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      status: e.status,
      start_date: e.startDate,
      end_date: e.endDate,
      description: e.description,
      format: e.format ?? null,
      prize_pool: e.prizePool ?? null,
      official_url: e.officialUrl ?? null,
    }))
  );
}

// ---- Videos ----
export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return VIDEOS;

  return data.map((d) => ({
    id: d.id,
    youtubeId: d.youtube_id,
    title: d.title,
    channelName: d.channel_name,
    thumbnailUrl: d.thumbnail_url,
    publishedAt: d.published_at,
    viewCount: d.view_count,
    durationSec: d.duration_sec,
    classTags: d.class_tags,
    tags: d.tags,
    isCurated: d.is_curated,
    curationNote: d.curation_note,
  }));
}

export async function saveVideos(videos: Video[]): Promise<void> {
  await supabase.from("videos").delete().neq("id", "___never___");
  if (videos.length === 0) return;
  await supabase.from("videos").insert(
    videos.map((v) => ({
      id: v.id,
      youtube_id: v.youtubeId,
      title: v.title,
      channel_name: v.channelName,
      thumbnail_url: v.thumbnailUrl,
      published_at: v.publishedAt,
      view_count: v.viewCount,
      duration_sec: v.durationSec,
      class_tags: v.classTags,
      tags: v.tags,
      is_curated: v.isCurated,
      curation_note: v.curationNote ?? null,
    }))
  );
}

// ---- Card Evaluations ----
export async function getCardEvaluations(): Promise<CardEvaluation[]> {
  const { data, error } = await supabase
    .from("card_evaluations")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return CARD_EVALUATIONS;

  return data.map((d) => ({
    id: d.id,
    cardName: d.card_name,
    className: d.class_name,
    rarity: d.rarity,
    cost: d.cost,
    setName: d.set_name,
    rating: d.rating,
    publishedAt: d.published_at,
    summary: d.summary,
    description: d.description,
    imageUrl: d.image_url,
  }));
}

export async function saveCardEvaluations(cards: CardEvaluation[]): Promise<void> {
  await supabase.from("card_evaluations").delete().neq("id", "___never___");
  if (cards.length === 0) return;
  await supabase.from("card_evaluations").insert(
    cards.map((c) => ({
      id: c.id,
      card_name: c.cardName,
      class_name: c.className,
      rarity: c.rarity,
      cost: c.cost,
      set_name: c.setName,
      rating: c.rating,
      published_at: c.publishedAt,
      summary: c.summary,
      description: c.description,
      image_url: c.imageUrl ?? null,
    }))
  );
}

// ---- Guides ----
export async function getGuides(): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return GUIDES;

  return data.map((d) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    className: d.class_name,
    publishedAt: d.published_at,
    updatedAt: d.updated_at,
    summary: d.summary,
    readMinutes: d.read_minutes,
    tags: d.tags,
  }));
}

export async function saveGuides(guides: Guide[]): Promise<void> {
  await supabase.from("guides").delete().neq("id", "___never___");
  if (guides.length === 0) return;
  await supabase.from("guides").insert(
    guides.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      class_name: g.className ?? null,
      published_at: g.publishedAt,
      updated_at: g.updatedAt,
      summary: g.summary,
      read_minutes: g.readMinutes,
      tags: g.tags,
    }))
  );
}
