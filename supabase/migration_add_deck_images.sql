-- decksテーブルに画像カラムを追加・不要カラムを削除するマイグレーション
-- Supabase SQL Editorで実行してください

ALTER TABLE decks ADD COLUMN IF NOT EXISTS key_card_images TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE decks ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE decks DROP COLUMN IF EXISTS deck_code;
