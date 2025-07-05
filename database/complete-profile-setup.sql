-- Complete Database Setup Script
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Check if profile_picture_url column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'profile_picture_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN profile_picture_url TEXT;
        RAISE NOTICE 'Added profile_picture_url column to profiles table';
    ELSE
        RAISE NOTICE 'profile_picture_url column already exists';
    END IF;
END $$;

-- Step 2: Add other missing columns if they don't exist
DO $$
BEGIN
    -- Add job_title column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'job_title'
    ) THEN
        ALTER TABLE profiles ADD COLUMN job_title TEXT;
        RAISE NOTICE 'Added job_title column to profiles table';
    END IF;

    -- Add motto column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'motto'
    ) THEN
        ALTER TABLE profiles ADD COLUMN motto TEXT;
        RAISE NOTICE 'Added motto column to profiles table';
    END IF;

    -- Add spark_count column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'spark_count'
    ) THEN
        ALTER TABLE profiles ADD COLUMN spark_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added spark_count column to profiles table';
    END IF;
END $$;

-- Step 3: Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-pictures', 'profile-pictures', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Step 4: Set up storage policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Profile pictures are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile pictures" ON storage.objects;

-- Policy to allow authenticated users to list buckets
DROP POLICY IF EXISTS "Allow authenticated users to list buckets" ON storage.buckets;
CREATE POLICY "Allow authenticated users to list buckets"
ON storage.buckets FOR SELECT 
TO authenticated 
USING (true);

-- Policy 1: Allow users to upload their own profile pictures
CREATE POLICY "Users can upload profile pictures" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Allow public read access to profile pictures
CREATE POLICY "Profile pictures are publicly accessible" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'profile-pictures');

-- Policy 3: Allow users to update their own profile pictures
CREATE POLICY "Users can update own profile pictures" ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Allow users to delete their own profile pictures
CREATE POLICY "Users can delete own profile pictures" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Success message
SELECT 'Profile picture setup completed successfully!' as status;
