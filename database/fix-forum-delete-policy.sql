-- Fix missing DELETE policy for forum_posts
-- This allows users to delete their own forum posts

-- Add DELETE policy for forum posts
CREATE POLICY "Users can delete own posts" ON forum_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Also add DELETE policy for forum comments (if needed)
CREATE POLICY "Users can delete own comments" ON forum_comments
  FOR DELETE USING (auth.uid() = author_id);
