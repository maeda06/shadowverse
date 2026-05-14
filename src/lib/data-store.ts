import fs from "fs";
import path from "path";
import {
  CURRENT_WEEK,
  DECK_RANKINGS,
  EVENTS,
  VIDEOS,
  CARD_EVALUATIONS,
  GUIDES,
} from "./mock-data";
import type { WeeklyMeta, Deck, Event, Video, CardEvaluation, Guide } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(filename: string, fallback: T): T {
  ensureDir();
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filepath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(filename: string, data: T): void {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// Weekly Meta
export function getWeeklyMeta(): WeeklyMeta {
  return readJson("weekly-meta.json", CURRENT_WEEK);
}
export function saveWeeklyMeta(data: WeeklyMeta): void {
  writeJson("weekly-meta.json", data);
}

// Decks
export function getDecks(): Deck[] {
  return readJson("decks.json", DECK_RANKINGS);
}
export function saveDecks(data: Deck[]): void {
  writeJson("decks.json", data);
}

// Events
export function getEvents(): Event[] {
  return readJson("events.json", EVENTS);
}
export function saveEvents(data: Event[]): void {
  writeJson("events.json", data);
}

// Videos
export function getVideos(): Video[] {
  return readJson("videos.json", VIDEOS);
}
export function saveVideos(data: Video[]): void {
  writeJson("videos.json", data);
}

// Card Evaluations
export function getCardEvaluations(): CardEvaluation[] {
  return readJson("card-evaluations.json", CARD_EVALUATIONS);
}
export function saveCardEvaluations(data: CardEvaluation[]): void {
  writeJson("card-evaluations.json", data);
}

// Guides
export function getGuides(): Guide[] {
  return readJson("guides.json", GUIDES);
}
export function saveGuides(data: Guide[]): void {
  writeJson("guides.json", data);
}
