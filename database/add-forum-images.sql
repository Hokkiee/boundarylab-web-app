-- Add image support to forum posts
-- This adds an images column to store multiple image URLs as JSON array

-- Add images column to forum_posts table
ALTER TABLE forum_posts 
ADD COLUMN images JSONB DEFAULT '[]'::jsonb;

-- Add index for better performance when querying posts with images
CREATE INDEX idx_forum_posts_images ON forum_posts USING GIN (images);

-- Create storage bucket for forum images (run this in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('forum-images', 'forum-images', true);

-- Set up storage policies for forum images
-- CREATE POLICY "Anyone can view forum images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'forum-images');

-- CREATE POLICY "Authenticated users can upload forum images" ON storage.objects
--   FOR INSERT TO authenticated WITH CHECK (bucket_id = 'forum-images');

-- CREATE POLICY "Users can delete their own forum images" ON storage.objects
--   FOR DELETE TO authenticated USING (bucket_id = 'forum-images' AND auth.uid()::text = (storage.foldername(name))[1]);
