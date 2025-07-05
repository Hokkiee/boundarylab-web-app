-- BoundaryLab Database Schema for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create glossary_terms table
CREATE TABLE glossary_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  example TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_glossary_progress table (tracks learning)
CREATE TABLE user_glossary_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  term_id UUID REFERENCES glossary_terms(id) ON DELETE CASCADE,
  is_learned BOOLEAN DEFAULT false,
  learned_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, term_id)
);

-- Create scenarios table
CREATE TABLE scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  situation TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'workplace',
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_time INTEGER DEFAULT 5, -- minutes
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scenario_choices table
CREATE TABLE scenario_choices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  consequence TEXT NOT NULL,
  boundary_strength INTEGER CHECK (boundary_strength BETWEEN 1 AND 5),
  explanation TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_scenario_completions table
CREATE TABLE user_scenario_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  choice_id UUID REFERENCES scenario_choices(id),
  reflection TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scenario_id)
);

-- Create forum_posts table
CREATE TABLE forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT DEFAULT 'general',
  is_anonymous BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_comments table
CREATE TABLE forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create boundary_assessments table
CREATE TABLE boundary_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_data JSONB NOT NULL,
  boundary_type TEXT,
  score INTEGER,
  recommendations TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Profiles are viewable by everyone, but only updatable by user themselves
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Glossary terms are readable by authenticated users
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Glossary terms are viewable by authenticated users" ON glossary_terms
  FOR SELECT USING (auth.role() = 'authenticated' AND is_published = true);

-- User progress is private to each user
ALTER TABLE user_glossary_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON user_glossary_progress
  FOR ALL USING (auth.uid() = user_id);

-- Scenarios are readable by authenticated users
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scenarios are viewable by authenticated users" ON scenarios
  FOR SELECT USING (auth.role() = 'authenticated' AND is_published = true);

-- Scenario choices are readable by authenticated users
ALTER TABLE scenario_choices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scenario choices are viewable by authenticated users" ON scenario_choices
  FOR SELECT USING (auth.role() = 'authenticated');

-- User scenario completions are private
ALTER TABLE user_scenario_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own completions" ON user_scenario_completions
  FOR ALL USING (auth.uid() = user_id);

-- Forum posts are readable by authenticated users
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum posts are viewable by authenticated users" ON forum_posts
  FOR SELECT USING (auth.role() = 'authenticated' AND is_published = true);

CREATE POLICY "Users can create posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON forum_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Forum comments are readable by authenticated users
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum comments are viewable by authenticated users" ON forum_comments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create comments" ON forum_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON forum_comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Boundary assessments are private
ALTER TABLE boundary_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own assessments" ON boundary_assessments
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_glossary_terms_category ON glossary_terms(category);
CREATE INDEX idx_glossary_terms_published ON glossary_terms(is_published);
CREATE INDEX idx_scenarios_category ON scenarios(category);
CREATE INDEX idx_scenarios_published ON scenarios(is_published);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_glossary_terms_updated_at BEFORE UPDATE ON glossary_terms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_comments_updated_at BEFORE UPDATE ON forum_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile trigger for new users
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

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a policy for profile creation
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
