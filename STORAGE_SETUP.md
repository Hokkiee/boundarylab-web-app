# Storage Bucket Setup for Profile Pictures

## Quick Setup Steps

### 1. Go to Your Supabase Dashboard
- Open your Supabase project dashboard
- Navigate to **Storage** in the left sidebar

### 2. Create the Bucket
1. Click **"New bucket"**
2. **Bucket name**: `profile-pictures`
3. **Public bucket**: ✅ Check this box
4. Click **"Create bucket"**

### 3. Set Storage Policies
Go to **Storage** → **Policies** and add these policies:

#### Policy 1: Allow users to upload their own pictures
```sql
CREATE POLICY "Users can upload profile pictures" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: Allow public read access
```sql
CREATE POLICY "Profile pictures are publicly accessible" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'profile-pictures');
```

#### Policy 3: Allow users to update their own pictures
```sql
CREATE POLICY "Users can update own profile pictures" ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 4: Allow users to delete their own pictures
```sql
CREATE POLICY "Users can delete own profile pictures" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Test the Upload
After creating the bucket and policies:
1. Go to your Profile page
2. Click "Edit" 
3. Try uploading a profile picture
4. The upload should now work!

## Troubleshooting

**If you still get errors:**

1. **Check your .env file** has correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Verify bucket exists**: Go to Storage in Supabase dashboard

3. **Check policies**: Make sure all 4 storage policies are created

4. **Try a small image first**: Use a small JPG/PNG file for testing

## Alternative: Simple URL Input (Temporary)

If you want to test the profile system without storage setup, I can modify the upload to accept image URLs instead of file uploads temporarily.
