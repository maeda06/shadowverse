-- Add deck recipe image and key card images to decks table
ALTER TABLE decks
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS key_card_images text[] DEFAULT '{}';
