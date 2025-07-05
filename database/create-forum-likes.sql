-- Create forum_likes table for post likes functionality
-- Run this SQL in your Supabase SQL Editor

-- Create forum_likes table
CREATE TABLE IF NOT EXISTS forum_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create functions to increment/decrement upvotes
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

-- Enable Row Level Security
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for forum_likes table
-- Users can view all likes
CREATE POLICY "Users can view forum likes" ON forum_likes
  FOR SELECT USING (true);

-- Users can insert their own likes
CREATE POLICY "Users can insert their own likes" ON forum_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes" ON forum_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_likes_post_id ON forum_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_user_id ON forum_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_post_user ON forum_likes(post_id, user_id);
