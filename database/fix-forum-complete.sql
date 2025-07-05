-- Complete forum functionality setup
-- Run this SQL in your Supabase SQL Editor to fix all forum-related issues

-- 1. Add images column to forum_posts table if it doesn't exist
ALTER TABLE forum_posts 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. Create forum_likes table
CREATE TABLE IF NOT EXISTS forum_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 3. Create functions to increment/decrement upvotes
CREATE OR REPLACE FUNCTION increment_post_upvotes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts 
  SET upvotes = upvotes + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_upvotes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts 
  SET upvotes = GREATEST(upvotes - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Enable Row Level Security for forum_likes
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for forum_likes table
-- Users can view all likes
CREATE POLICY "Users can view forum likes" ON forum_likes
  FOR SELECT USING (true);

-- Users can insert their own likes
CREATE POLICY "Users can insert their own likes" ON forum_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes" ON forum_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_images ON forum_posts USING GIN (images);
CREATE INDEX IF NOT EXISTS idx_forum_likes_post_id ON forum_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_user_id ON forum_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_post_user ON forum_likes(post_id, user_id);

-- 7. Create storage bucket for forum images if it doesn't exist
-- Note: You may need to run this manually in the Supabase dashboard
-- INSERT INTO storage.buckets (id, name, public) VALUES ('forum-images', 'forum-images', true)
--   ON CONFLICT (id) DO NOTHING;

-- 8. Verify the setup
SELECT 
  'forum_posts' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'forum_posts' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
  'forum_likes' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'forum_likes' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
