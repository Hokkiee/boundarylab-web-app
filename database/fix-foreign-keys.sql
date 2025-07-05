-- Database migration to fix foreign key issues
-- Run this script in your Supabase SQL Editor to fix the forum post creation issues

-- 1. First, check for existing users without profiles and create them
INSERT INTO public.profiles (id, email, display_name)
SELECT 
    id, 
    email, 
    COALESCE(
        raw_user_meta_data->>'display_name', 
        email
    ) as display_name
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 2. Add the auto-profile creation trigger if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Add policy for profile creation if it doesn't exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Verify the foreign key constraints are properly set
-- If there are orphaned forum posts, this will help identify them
DO $$
DECLARE
    orphaned_count integer;
BEGIN
    SELECT COUNT(*) INTO orphaned_count
    FROM forum_posts fp
    LEFT JOIN profiles p ON fp.author_id = p.id
    WHERE p.id IS NULL;
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Found % orphaned forum posts without matching profiles', orphaned_count;
        -- Optionally delete orphaned posts
        -- DELETE FROM forum_posts WHERE author_id NOT IN (SELECT id FROM profiles);
    ELSE
        RAISE NOTICE 'No orphaned forum posts found';
    END IF;
END $$;

-- 5. Update RLS policies to be more permissive for troubleshooting
-- Allow profile creation for authenticated users
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Ensure forum post creation works for authenticated users
DROP POLICY IF EXISTS "Users can create posts" ON forum_posts;
CREATE POLICY "Users can create posts" ON forum_posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND 
    auth.uid() IN (SELECT id FROM profiles)
  );
