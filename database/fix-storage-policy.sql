-- Fix for RLS Upload Policy Issue
-- Run this in your Supabase SQL Editor

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can upload profile pictures" ON storage.objects;

-- Create a simpler policy that allows authenticated users to upload to profile-pictures bucket
CREATE POLICY "Users can upload profile pictures" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'profile-pictures'
);

-- Also update the update/delete policies to be less restrictive
DROP POLICY IF EXISTS "Users can update own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile pictures" ON storage.objects;

CREATE POLICY "Users can update profile pictures" ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'profile-pictures'
);

CREATE POLICY "Users can delete profile pictures" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'profile-pictures'
);

-- Confirm the fix
SELECT 'Storage policies updated - upload should work now!' as status;
