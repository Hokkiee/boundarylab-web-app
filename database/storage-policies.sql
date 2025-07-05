-- Alternative: Create the bucket via SQL (if you prefer this approach)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);

-- Storage Policies for Profile Pictures Bucket
-- Run these commands in your Supabase SQL Editor after creating the 'profile-pictures' bucket

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
