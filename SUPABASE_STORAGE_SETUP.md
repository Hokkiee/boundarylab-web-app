# Supabase Storage Setup for Forum Images

## 1. Create the Storage Bucket

1. Go to your Supabase dashboard
2. Navigate to **Storage** in the sidebar
3. Click **"Create bucket"**
4. Set the bucket name to: `forum-images`
5. Make sure **"Public bucket"** is enabled (checked)
6. Click **"Create bucket"**

## 2. Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies to allow authenticated users to upload and view images.

### Option A: Using Supabase Dashboard
1. Go to **Storage** → **Policies**
2. Find the `forum-images` bucket
3. Click **"New policy"**
4. Create the following policies:

**Policy 1: Allow authenticated users to upload**
- Policy name: `Allow authenticated uploads`
- Target roles: `authenticated`
- Allowed operations: `INSERT`
- Using expression: `auth.role() = 'authenticated'`

**Policy 2: Allow public access to view images**
- Policy name: `Allow public access`
- Target roles: `public`
- Allowed operations: `SELECT`
- Using expression: `true`

### Option B: Using SQL Commands
Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload images to forum-images bucket
CREATE POLICY "Allow authenticated users to upload forum images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'forum-images');

-- Allow public access to view forum images
CREATE POLICY "Allow public access to forum images" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'forum-images');

-- Allow authenticated users to delete their own images (optional)
CREATE POLICY "Allow users to delete their own forum images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'forum-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 3. Test the Setup

After setting up the bucket and policies:

1. Go back to your forum page
2. Try creating a new post with images
3. The images should now upload successfully to Supabase Storage
4. Check the Storage section in your Supabase dashboard to see the uploaded files

## 4. Troubleshooting

If you encounter issues:

1. **Check bucket permissions**: Ensure the bucket is public and RLS policies are correctly set
2. **Verify Supabase credentials**: Make sure your `.env` file has the correct Supabase URL and anon key
3. **Check browser console**: Look for any error messages during upload
4. **Storage quota**: Ensure you haven't exceeded your Supabase storage quota

## 5. File Structure

Once working, your uploaded images will be stored in Supabase Storage with this structure:
```
forum-images/
├── 1641234567890-abc123.jpg
├── 1641234567891-def456.png
└── ...
```

The images will be accessible via public URLs like:
```
https://your-project.supabase.co/storage/v1/object/public/forum-images/filename.jpg
```
