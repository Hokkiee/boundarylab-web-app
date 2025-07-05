-- Enhanced Profile Database Schema
-- Add these tables to support enhanced profile features

-- User preferences and settings
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT true,
  forum_notifications BOOLEAN DEFAULT true,
  progress_reminders BOOLEAN DEFAULT true,
  
  -- Privacy settings
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  show_progress_publicly BOOLEAN DEFAULT false,
  allow_mentorship BOOLEAN DEFAULT true,
  
  -- Personal boundary categories (user-defined)
  custom_categories JSONB DEFAULT '[]',
  
  -- Personal mantras/reminders
  boundary_mantras TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- User goals and action plans
CREATE TABLE user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  target_date DATE,
  
  -- Goal metrics
  is_completed BOOLEAN DEFAULT false,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  
  -- Action items (stored as JSONB array)
  action_items JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- User achievements and badges
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  achievement_type TEXT NOT NULL, -- 'scenario_completion', 'forum_participation', 'streak', 'milestone'
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name or emoji
  
  -- Achievement metadata
  earned_for TEXT, -- What specifically earned this (e.g., "completed 10 scenarios")
  points_awarded INTEGER DEFAULT 0,
  
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_type, achievement_name)
);

-- Enhanced reflection journal (extends the existing reflection in user_scenario_completions)
CREATE TABLE user_reflection_journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Link to scenario completion if applicable
  scenario_completion_id UUID REFERENCES user_scenario_completions(id) ON DELETE SET NULL,
  
  title TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'scenario', 'daily', 'breakthrough', 'challenge'
  mood TEXT, -- 'positive', 'neutral', 'challenging', 'breakthrough'
  
  -- Tags for organization
  tags TEXT[] DEFAULT '{}',
  
  -- Privacy settings
  is_private BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress snapshots (for analytics)
CREATE TABLE user_progress_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Snapshot date
  snapshot_date DATE DEFAULT CURRENT_DATE,
  
  -- Progress metrics
  scenarios_completed INTEGER DEFAULT 0,
  glossary_terms_learned INTEGER DEFAULT 0,
  forum_posts_created INTEGER DEFAULT 0,
  reflections_written INTEGER DEFAULT 0,
  
  -- Boundary strength metrics
  average_boundary_strength DECIMAL(3,2), -- Average of all scenario choices
  boundary_consistency_score DECIMAL(3,2), -- How consistent user is
  
  -- Engagement metrics
  days_active INTEGER DEFAULT 0, -- Days active this period
  streak_days INTEGER DEFAULT 0, -- Current streak
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, snapshot_date)
);

-- Community connections (for mentorship/friendship)
CREATE TABLE user_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  connection_type TEXT DEFAULT 'friend' CHECK (connection_type IN ('friend', 'mentor', 'mentee')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  message TEXT, -- Optional message with request
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(requester_id, recipient_id),
  CHECK (requester_id != recipient_id)
);

-- RLS Policies for new tables

-- User preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- User goals
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own goals" ON user_goals
  FOR ALL USING (auth.uid() = user_id);

-- User achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create achievements" ON user_achievements
  FOR INSERT WITH CHECK (true); -- Achievements created by system/triggers

-- Reflection journal
ALTER TABLE user_reflection_journal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own reflections" ON user_reflection_journal
  FOR ALL USING (auth.uid() = user_id);

-- Progress snapshots
ALTER TABLE user_progress_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON user_progress_snapshots
  FOR SELECT USING (auth.uid() = user_id);

-- User connections
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their connections" ON user_connections
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can create connection requests" ON user_connections
  FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can respond to connection requests" ON user_connections
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Indexes for performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX idx_user_goals_completion ON user_goals(user_id, is_completed);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_reflection_journal_user_id ON user_reflection_journal(user_id);
CREATE INDEX idx_reflection_journal_category ON user_reflection_journal(user_id, category);
CREATE INDEX idx_progress_snapshots_user_date ON user_progress_snapshots(user_id, snapshot_date);
CREATE INDEX idx_user_connections_requester ON user_connections(requester_id);
CREATE INDEX idx_user_connections_recipient ON user_connections(recipient_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reflection_journal_updated_at BEFORE UPDATE ON user_reflection_journal
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
