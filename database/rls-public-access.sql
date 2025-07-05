-- Additional RLS Policies for BoundaryLab
-- Run this AFTER schema.sql if you want to allow anonymous access to some content
-- This enables the forum and glossary to work without requiring user authentication

-- Allow anonymous users to read published glossary terms
DROP POLICY IF EXISTS "Glossary terms are viewable by authenticated users" ON glossary_terms;
CREATE POLICY "Glossary terms are viewable by everyone" ON glossary_terms
  FOR SELECT USING (is_published = true);

-- Allow anonymous users to read published scenarios  
DROP POLICY IF EXISTS "Scenarios are viewable by authenticated users" ON scenarios;
CREATE POLICY "Scenarios are viewable by everyone" ON scenarios
  FOR SELECT USING (is_published = true);

-- Allow anonymous users to read scenario choices
DROP POLICY IF EXISTS "Scenario choices are viewable by authenticated users" ON scenario_choices;
CREATE POLICY "Scenario choices are viewable by everyone" ON scenario_choices
  FOR SELECT USING (true);

-- Allow anonymous users to read published forum posts
DROP POLICY IF EXISTS "Forum posts are viewable by authenticated users" ON forum_posts;
CREATE POLICY "Forum posts are viewable by everyone" ON forum_posts
  FOR SELECT USING (is_published = true);

-- Allow anonymous users to read forum comments
DROP POLICY IF EXISTS "Forum comments are viewable by authenticated users" ON forum_comments;
CREATE POLICY "Forum comments are viewable by everyone" ON forum_comments
  FOR SELECT USING (true);

-- Keep the creation/update policies for authenticated users only
-- (These are already defined in schema.sql and don't need to change)

-- Note: With these policies:
-- ✅ Anyone can browse glossary, scenarios, and forum posts
-- ✅ Only authenticated users can create posts/comments
-- ✅ Only users can edit their own content
-- ✅ User progress and assessments remain private
