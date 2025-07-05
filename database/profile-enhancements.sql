-- Profile Enhancement Schema
-- Run this after fix-foreign-keys.sql to add spark system and enhanced profiles

-- 1. Extend profiles table with new fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS motto TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spark_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- 2. Create sparks table for tracking who sparked what
CREATE TABLE IF NOT EXISTS user_sparks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sender_id, post_id) -- One spark per person per post
);

-- 3. Create user_reflections table for managing reflection privacy
CREATE TABLE IF NOT EXISTS user_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scenario_completion_id UUID REFERENCES user_scenario_completions(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(scenario_completion_id) -- One reflection privacy setting per completion
);

-- 4. Create notifications table for spark notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'spark',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  related_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create function to handle spark creation and update counts
CREATE OR REPLACE FUNCTION handle_spark_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Update recipient's spark count
  UPDATE profiles 
  SET spark_count = spark_count + 1 
  WHERE id = NEW.recipient_id;
  
  -- Create notification for recipient
  INSERT INTO notifications (user_id, type, title, message, sender_id, related_post_id)
  SELECT 
    NEW.recipient_id,
    'spark',
    'You received a spark! ✨',
    sender.display_name || ' sent you a spark - your words resonated!',
    NEW.sender_id,
    NEW.post_id
  FROM profiles sender
  WHERE sender.id = NEW.sender_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to handle spark deletion (if user unsparks)
CREATE OR REPLACE FUNCTION handle_spark_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Update recipient's spark count
  UPDATE profiles 
  SET spark_count = spark_count - 1 
  WHERE id = OLD.recipient_id AND spark_count > 0;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create triggers for spark management
CREATE TRIGGER on_spark_created
  AFTER INSERT ON user_sparks
  FOR EACH ROW EXECUTE FUNCTION handle_spark_creation();

CREATE TRIGGER on_spark_deleted
  AFTER DELETE ON user_sparks
  FOR EACH ROW EXECUTE FUNCTION handle_spark_deletion();

-- 8. Row Level Security policies

-- User sparks policies
ALTER TABLE user_sparks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sparks" ON user_sparks
  FOR SELECT USING (true);

CREATE POLICY "Users can create sparks" ON user_sparks
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own sparks" ON user_sparks
  FOR DELETE USING (auth.uid() = sender_id);

-- User reflections policies
ALTER TABLE user_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reflection privacy" ON user_reflections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public reflections are viewable by everyone" ON user_reflections
  FOR SELECT USING (is_public = true);

-- Notifications policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sparks_recipient ON user_sparks(recipient_id);
CREATE INDEX IF NOT EXISTS idx_user_sparks_sender ON user_sparks(sender_id);
CREATE INDEX IF NOT EXISTS idx_user_sparks_post ON user_sparks(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reflections_user ON user_reflections(user_id);

-- 10. Create updated_at trigger for user_reflections
CREATE TRIGGER update_user_reflections_updated_at BEFORE UPDATE ON user_reflections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Storage bucket for profile pictures (run this in Supabase dashboard or via API)
-- Note: You'll need to create the 'profile-pictures' bucket in Supabase Storage
-- and set appropriate policies. Here are the recommended policies:

-- Storage policies for profile pictures:
-- 1. Allow authenticated users to upload their own profile pictures
-- 2. Allow public read access to profile pictures
-- 3. Allow users to update/delete their own profile pictures

-- Example storage policies (adapt as needed):
/*
-- Policy: "Users can upload their own profile pictures"
-- ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy: "Profile pictures are publicly accessible"  
-- ON storage.objects FOR SELECT TO public USING (bucket_id = 'profile-pictures');

-- Policy: "Users can update their own profile pictures"
-- ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy: "Users can delete their own profile pictures"
-- ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
*/
