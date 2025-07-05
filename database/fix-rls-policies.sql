-- Fix RLS policies for forum functionality
-- Run this SQL in your Supabase SQL Editor to fix 406 errors

-- 1. Drop existing restrictive policies for forum_posts
DROP POLICY IF EXISTS "Forum posts are viewable by authenticated users" ON forum_posts;
DROP POLICY IF EXISTS "Users can create posts" ON forum_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON forum_posts;

-- 2. Create more permissive policies for forum_posts
-- Allow public read access to published posts
CREATE POLICY "Forum posts are publicly viewable" ON forum_posts
  FOR SELECT USING (is_published = true);

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update own posts" ON forum_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete own posts" ON forum_posts
  FOR DELETE USING (auth.uid() = author_id);

-- 3. Ensure forum_likes policies are correct (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'forum_likes') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view forum likes" ON forum_likes;
    DROP POLICY IF EXISTS "Users can insert their own likes" ON forum_likes;
    DROP POLICY IF EXISTS "Users can delete their own likes" ON forum_likes;
    
    -- Create new policies
    CREATE POLICY "Forum likes are publicly viewable" ON forum_likes
      FOR SELECT USING (true);
    
    CREATE POLICY "Authenticated users can insert likes" ON forum_likes
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete their own likes" ON forum_likes
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Fix profiles table access (if needed)
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
CREATE POLICY "Profiles are publicly viewable for forum" ON profiles
  FOR SELECT USING (true);

-- Allow users to update their own profiles
CREATE POLICY "Users can update own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profiles
CREATE POLICY "Users can insert own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Test the policies by checking what we can access
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('forum_posts', 'forum_likes', 'profiles')
ORDER BY tablename, policyname;
