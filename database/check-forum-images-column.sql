-- Check if the images column exists and is properly configured
-- Run this to verify the forum_posts table structure

-- Check the current structure of forum_posts table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'forum_posts' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any existing indexes on the images column
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'forum_posts' 
  AND indexdef LIKE '%images%';

-- If you need to modify the existing images column (only run if needed):
-- ALTER TABLE forum_posts ALTER COLUMN images SET DEFAULT '[]'::jsonb;
-- ALTER TABLE forum_posts ALTER COLUMN images SET NOT NULL;

-- If you need to add the index and it doesn't exist:
-- CREATE INDEX IF NOT EXISTS idx_forum_posts_images ON forum_posts USING GIN (images);
