-- Shadowverse WB メタ分析サイト — Supabase スキーマ
-- Supabaseの「SQL Editor」でこのファイルの内容を実行してください

-- ①週次メタ統計（常に1行を更新）
CREATE TABLE IF NOT EXISTS weekly_meta (
  id          INT PRIMARY KEY DEFAULT 1,
  week_start  DATE NOT NULL,
  week_end    DATE NOT NULL,
  week_number INT NOT NULL,
  format      TEXT NOT NULL,
  class_stats JSONB NOT NULL DEFAULT '[]',
  total_games INT NOT NULL DEFAULT 0,
  summary     TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ②デッキランキング
CREATE TABLE IF NOT EXISTS decks (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  class_name      TEXT NOT NULL,
  archetype       TEXT NOT NULL DEFAULT '',
  rank            INT NOT NULL DEFAULT 99,
  win_rate        FLOAT NOT NULL DEFAULT 50,
  usage_rate      FLOAT NOT NULL DEFAULT 0,
  prev_win_rate   FLOAT NOT NULL DEFAULT 50,
  difficulty      INT NOT NULL DEFAULT 3,
  cost_level      INT NOT NULL DEFAULT 3,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  description     TEXT NOT NULL DEFAULT '',
  strategy        TEXT NOT NULL DEFAULT '',
  key_cards       TEXT[] NOT NULL DEFAULT '{}',
  key_card_images TEXT[] NOT NULL DEFAULT '{}',
  sample_count    INT NOT NULL DEFAULT 0,
  image_url       TEXT
);

-- ③イベント
CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL,
  status      TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  format      TEXT,
  prize_pool  TEXT,
  official_url TEXT
);

-- ④動画
CREATE TABLE IF NOT EXISTS videos (
  id            TEXT PRIMARY KEY,
  youtube_id    TEXT NOT NULL,
  title         TEXT NOT NULL,
  channel_name  TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  published_at  DATE NOT NULL,
  view_count    INT NOT NULL DEFAULT 0,
  duration_sec  INT NOT NULL DEFAULT 0,
  class_tags    TEXT[] NOT NULL DEFAULT '{}',
  tags          TEXT[] NOT NULL DEFAULT '{}',
  is_curated    BOOLEAN NOT NULL DEFAULT FALSE,
  curation_note TEXT
);

-- ⑤カード評価
CREATE TABLE IF NOT EXISTS card_evaluations (
  id           TEXT PRIMARY KEY,
  card_name    TEXT NOT NULL,
  class_name   TEXT NOT NULL,
  rarity       TEXT NOT NULL,
  cost         INT NOT NULL DEFAULT 0,
  set_name     TEXT NOT NULL DEFAULT '',
  rating       TEXT NOT NULL,
  published_at DATE NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  image_url    TEXT
);

-- ⑥攻略ガイド
CREATE TABLE IF NOT EXISTS guides (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL,
  class_name   TEXT,
  published_at DATE NOT NULL,
  updated_at   DATE NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  read_minutes INT NOT NULL DEFAULT 5,
  tags         TEXT[] NOT NULL DEFAULT '{}'
);
