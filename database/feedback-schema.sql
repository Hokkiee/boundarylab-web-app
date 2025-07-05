-- Feedback table to store user feedback submissions
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN ('bug', 'feature', 'general', 'appreciation')),
  feedback_text TEXT NOT NULL,
  contact_email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  admin_notes TEXT,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for better query performance
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_type ON feedback(feedback_type);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
CREATE INDEX idx_feedback_priority ON feedback(priority);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feedback_updated_at_trigger
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_updated_at();

-- Add admin column to profiles table if it doesn't exist
-- This assumes you have a profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- RLS (Row Level Security) policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can create feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all feedback (you'll need to implement admin role checking)
-- For now, this is a placeholder - you'll need to add admin role logic
CREATE POLICY "Admins can view all feedback" ON feedback
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create feedback responses table for admin replies
CREATE TABLE feedback_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID REFERENCES feedback(id) ON DELETE CASCADE NOT NULL,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  response_text TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false, -- Whether the response is visible to the user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for feedback responses
CREATE INDEX idx_feedback_responses_feedback_id ON feedback_responses(feedback_id);
CREATE INDEX idx_feedback_responses_admin_user_id ON feedback_responses(admin_user_id);
CREATE INDEX idx_feedback_responses_created_at ON feedback_responses(created_at);

-- RLS for feedback responses
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;

-- Users can view public responses to their own feedback
CREATE POLICY "Users can view public responses to own feedback" ON feedback_responses
  FOR SELECT USING (
    is_public = true AND 
    EXISTS (
      SELECT 1 FROM feedback 
      WHERE feedback.id = feedback_responses.feedback_id 
      AND feedback.user_id = auth.uid()
    )
  );

-- Admins can manage all responses
CREATE POLICY "Admins can manage feedback responses" ON feedback_responses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create a view for feedback with user details (for admin dashboard)
CREATE OR REPLACE VIEW feedback_with_user_details AS
SELECT 
  f.*,
  p.display_name,
  p.avatar_url,
  u.email as user_email,
  (
    SELECT COUNT(*) 
    FROM feedback_responses fr 
    WHERE fr.feedback_id = f.id
  ) as response_count
FROM feedback f
LEFT JOIN profiles p ON f.user_id = p.id
LEFT JOIN auth.users u ON f.user_id = u.id
ORDER BY f.created_at DESC;

-- Grant permissions on the view
GRANT SELECT ON feedback_with_user_details TO authenticated;
