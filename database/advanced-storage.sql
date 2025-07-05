-- Advanced Storage Setup for BoundaryLab Pro
-- Run these in your Supabase SQL Editor

-- 1. Create additional storage buckets
-- (These need to be created in Supabase Dashboard Storage section)

-- Bucket: 'user-content' (for user-generated content)
-- Bucket: 'resources' (for educational resources)
-- Bucket: 'audio-recordings' (for voice reflections)
-- Bucket: 'documents' (for PDFs, worksheets)

-- 2. Enhanced storage policies

-- User content bucket policies
CREATE POLICY "Authenticated users can upload user content" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'user-content');

CREATE POLICY "Users can view their own content" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'user-content' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own content" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'user-content' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own content" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'user-content' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Resources bucket policies (public read, admin write)
CREATE POLICY "Public access to resources" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'resources');

CREATE POLICY "Admins can manage resources" ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'resources' AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Audio recordings policies
CREATE POLICY "Users can upload audio recordings" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audio-recordings' AND
    -- Only allow audio file types
    (lower(right(name, 4)) IN ('.mp3', '.wav', '.m4a') OR 
     lower(right(name, 5)) = '.webm')
  );

CREATE POLICY "Users can access their own audio recordings" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'audio-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Documents bucket policies
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    -- Only allow document types
    (lower(right(name, 4)) IN ('.pdf', '.doc', '.txt') OR 
     lower(right(name, 5)) IN ('.docx', '.xlsx'))
  );

CREATE POLICY "Public access to shared documents" ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'documents' AND
    -- Only allow access to files in 'public' folder
    (storage.foldername(name))[1] = 'public'
  );

-- 3. Create table for tracking user file uploads
CREATE TABLE user_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  bucket_name TEXT NOT NULL,
  upload_purpose TEXT CHECK (upload_purpose IN ('profile_picture', 'forum_image', 'reflection_audio', 'resource_document', 'other')),
  related_id UUID, -- Could reference forum_posts, scenarios, etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_uploads
ALTER TABLE user_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own uploads" ON user_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own uploads" ON user_uploads
  FOR ALL USING (auth.uid() = user_id);

-- 4. Create function to clean up unused files
CREATE OR REPLACE FUNCTION cleanup_unused_files()
RETURNS INTEGER AS $$
DECLARE
    cleanup_count INTEGER := 0;
    unused_file RECORD;
BEGIN
    -- Find files uploaded more than 24 hours ago that aren't referenced
    FOR unused_file IN
        SELECT uu.file_path, uu.bucket_name
        FROM user_uploads uu
        LEFT JOIN forum_posts fp ON uu.related_id = fp.id AND uu.upload_purpose = 'forum_image'
        LEFT JOIN profiles p ON uu.user_id = p.id AND uu.upload_purpose = 'profile_picture'
        WHERE uu.created_at < NOW() - INTERVAL '24 hours'
        AND fp.id IS NULL 
        AND (uu.upload_purpose != 'profile_picture' OR p.avatar_url != uu.file_path)
    LOOP
        -- Delete from storage (this would need to be done via API call)
        -- For now, just mark as cleanup needed
        UPDATE user_uploads 
        SET metadata = jsonb_set(metadata, '{cleanup_needed}', 'true'::jsonb)
        WHERE file_path = unused_file.file_path;
        
        cleanup_count := cleanup_count + 1;
    END LOOP;
    
    RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql;

-- 5. Create view for storage usage analytics
CREATE OR REPLACE VIEW storage_usage_analytics AS
SELECT 
    p.id as user_id,
    p.display_name,
    COUNT(uu.id) as total_files,
    SUM(uu.file_size) as total_storage_bytes,
    ROUND(SUM(uu.file_size) / 1024.0 / 1024.0, 2) as total_storage_mb,
    COUNT(CASE WHEN uu.upload_purpose = 'forum_image' THEN 1 END) as forum_images,
    COUNT(CASE WHEN uu.upload_purpose = 'profile_picture' THEN 1 END) as profile_pictures,
    COUNT(CASE WHEN uu.upload_purpose = 'reflection_audio' THEN 1 END) as audio_reflections,
    COUNT(CASE WHEN uu.upload_purpose = 'resource_document' THEN 1 END) as documents,
    MAX(uu.created_at) as last_upload_date
FROM profiles p
LEFT JOIN user_uploads uu ON p.id = uu.user_id
GROUP BY p.id, p.display_name;

-- 6. Create indexes for performance
CREATE INDEX idx_user_uploads_user_id ON user_uploads(user_id);
CREATE INDEX idx_user_uploads_purpose ON user_uploads(upload_purpose);
CREATE INDEX idx_user_uploads_created_at ON user_uploads(created_at);
CREATE INDEX idx_user_uploads_bucket ON user_uploads(bucket_name);

-- 7. Create trigger for updated_at
CREATE TRIGGER update_user_uploads_updated_at 
BEFORE UPDATE ON user_uploads
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON storage_usage_analytics TO authenticated;
GRANT SELECT ON user_uploads TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_unused_files() TO authenticated;
