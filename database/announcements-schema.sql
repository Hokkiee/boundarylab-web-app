-- Create announcements table
CREATE TABLE announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('product', 'features', 'community', 'content', 'technical', 'upcoming')),
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    author_id UUID REFERENCES auth.users(id),
    author_name TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies for announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Public read access for published announcements
CREATE POLICY "Anyone can view published announcements" ON announcements
    FOR SELECT USING (published = true);

-- Admin users can do everything
CREATE POLICY "Admin users can manage announcements" ON announcements
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_announcements_published ON announcements(published);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_announcements_featured ON announcements(featured);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

-- Add admin column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample announcements
INSERT INTO announcements (title, content, category, featured, author_name, tags) VALUES
(
    '🚀 Welcome to BoundaryLab Beta!',
    'We''re thrilled to launch BoundaryLab, your personal guide to understanding and establishing healthy boundaries. This beta version includes our core features: interactive scenarios, community discussions, and personalized boundary insights.',
    'product',
    true,
    'BoundaryLab Team',
    ARRAY['Launch', 'Beta', 'Features']
),
(
    '🎯 New Interactive Scenarios Available',
    'Explore 15 new boundary scenarios covering workplace dynamics, family relationships, and social situations. Each scenario includes personalized feedback and actionable insights to help you navigate real-world boundary challenges.',
    'features',
    true,
    'Content Team',
    ARRAY['Scenarios', 'New Content', 'Interactive']
),
(
    '💬 Community Forum Now Live',
    'Connect with other young adults on their boundary journey! Share experiences, ask questions, and support each other in our new community forum. Remember to follow our community guidelines for a safe and supportive environment.',
    'community',
    false,
    'Community Team',
    ARRAY['Forum', 'Community', 'Discussion']
),
(
    '📚 Boundary Glossary Updated',
    'We''ve added 20 new terms to our boundary glossary, including definitions for emotional boundaries, digital boundaries, and boundary repair. Each term includes real-world examples and practical tips.',
    'content',
    false,
    'Content Team',
    ARRAY['Glossary', 'Education', 'Resources']
),
(
    '🔧 Performance Improvements',
    'We''ve optimized the app for better performance and faster loading times. The scenario engine now runs 40% faster, and we''ve improved the overall user experience across all devices.',
    'technical',
    false,
    'Development Team',
    ARRAY['Performance', 'Technical', 'Optimization']
),
(
    '📅 Upcoming: Personal Boundary Assessments',
    'Coming soon: Take personalized assessments to understand your boundary strengths and areas for growth. Get tailored recommendations and track your progress over time.',
    'upcoming',
    false,
    'Product Team',
    ARRAY['Coming Soon', 'Assessment', 'Personalization']
);
