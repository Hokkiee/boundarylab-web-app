-- Sample Data for BoundaryLab
-- Run this AFTER schema.sql to populate initial data

-- Insert sample glossary terms
INSERT INTO glossary_terms (term, definition, example, category, severity, tags) VALUES
('Gaslighting', 'A form of psychological manipulation where someone makes you question your own memory, perception, or judgment.', 'When someone repeatedly tells you "that never happened" about events you clearly remember.', 'manipulation', 'high', ARRAY['workplace', 'relationships', 'manipulation']),

('Love Bombing', 'Overwhelming someone with excessive affection, attention, and admiration early in a relationship to gain control.', 'Receiving constant gifts, messages, and declarations of love very early in dating.', 'manipulation', 'medium', ARRAY['relationships', 'dating', 'manipulation']),

('Boundary Testing', 'When someone deliberately pushes against your stated boundaries to see if you''ll enforce them.', 'Continuing to text after you''ve asked for space, or making jokes about topics you''ve said make you uncomfortable.', 'violation', 'medium', ARRAY['boundaries', 'testing', 'workplace', 'relationships']),

('Microaggression', 'Brief, everyday exchanges that send denigrating messages to members of marginalized groups.', 'Comments like "You''re so articulate" to a person of color, or "You throw like a girl" as an insult.', 'subtle-harm', 'low', ARRAY['discrimination', 'workplace', 'social']),

('Emotional Labor', 'The unpaid, often unrecognized work of managing emotions and relationships.', 'Always being expected to comfort others, remember social obligations, or manage group dynamics.', 'exploitation', 'medium', ARRAY['workplace', 'relationships', 'inequality']),

('Silent Treatment', 'Deliberately ignoring someone as a form of punishment or control.', 'Refusing to respond to messages or acknowledge someone''s presence after a disagreement.', 'manipulation', 'medium', ARRAY['relationships', 'manipulation', 'punishment']),

('Triangulation', 'Using a third person to communicate with someone instead of direct communication, often to create drama or control.', 'Getting your friend to tell your partner you''re upset instead of talking to them directly.', 'manipulation', 'medium', ARRAY['relationships', 'communication', 'manipulation']),

('DARVO', 'Deny, Attack, and Reverse Victim and Offender - a manipulation tactic where the perpetrator becomes the victim.', 'When called out for hurtful behavior, responding with "I can''t believe you''re attacking me like this."', 'manipulation', 'high', ARRAY['manipulation', 'deflection', 'relationships']);

-- Insert sample scenarios
INSERT INTO scenarios (title, description, situation, category, difficulty) VALUES
('Workplace Boundary Setting', 'Practice setting boundaries with colleagues who overstep', 'Your coworker keeps asking you to cover their shifts at the last minute, making you feel guilty when you say no. They say things like "I thought we were friends" and "You''re the only one I can count on."', 'workplace', 'beginner'),

('Social Media Boundaries', 'Navigate uncomfortable online interactions', 'A friend keeps tagging you in posts that make you uncomfortable and sharing personal details about your life without asking. When you mention it, they say "It''s just social media, don''t be so sensitive."', 'social', 'beginner'),

('Family Dinner Dynamics', 'Handle inappropriate comments from relatives', 'At family gatherings, your uncle makes comments about your appearance, career choices, or relationship status that make you uncomfortable. Other family members say "That''s just how he is" when you object.', 'family', 'intermediate'),

('Dating Red Flags', 'Recognize and respond to concerning dating behavior', 'Someone you''ve been on a few dates with shows up at your workplace uninvited, saying they "wanted to surprise you." They''ve also been texting you constantly and get upset when you don''t respond immediately.', 'dating', 'intermediate');

-- Insert scenario choices for first scenario
INSERT INTO scenario_choices (scenario_id, choice_text, consequence, boundary_strength, explanation, sort_order) VALUES
((SELECT id FROM scenarios WHERE title = 'Workplace Boundary Setting' LIMIT 1), 
 'Say yes again to avoid conflict', 
 'You cover the shift but feel resentful. Your coworker continues to rely on you and the pattern escalates.', 
 1, 
 'Avoiding conflict in the short term often leads to bigger problems and more boundary violations.', 
 1),

((SELECT id FROM scenarios WHERE title = 'Workplace Boundary Setting' LIMIT 1), 
 'Explain that you need advance notice for schedule changes', 
 'Your coworker pushes back but eventually starts giving you more notice. The friendship dynamic improves.', 
 4, 
 'Setting clear expectations while maintaining kindness is an effective boundary strategy.', 
 2),

((SELECT id FROM scenarios WHERE title = 'Workplace Boundary Setting' LIMIT 1), 
 'Tell them you can no longer cover last-minute shifts', 
 'There''s initial tension, but your coworker learns to plan better and finds other solutions.', 
 5, 
 'Firm boundaries protect your time and energy while encouraging others to be more responsible.', 
 3),

((SELECT id FROM scenarios WHERE title = 'Workplace Boundary Setting' LIMIT 1), 
 'Talk to your manager about the situation', 
 'Your manager helps mediate and establishes clearer shift-change policies for everyone.', 
 3, 
 'Sometimes involving authority figures can help when direct communication isn''t working.', 
 4);

-- Insert sample forum posts
INSERT INTO forum_posts (title, content, author_id, category) VALUES
('How do you handle guilt after setting boundaries?', 'I finally told my friend I couldn''t be their free therapist anymore, but I feel so guilty. They''re going through a hard time and I feel like I''m abandoning them. How do you deal with the guilt that comes after setting a necessary boundary?', NULL, 'support'),

('Workplace boundaries during remote work', 'My boss expects me to be available 24/7 just because I work from home. They send messages at all hours and get annoyed if I don''t respond immediately. How do I set boundaries without seeming unprofessional?', NULL, 'workplace'),

('Small victory: I said no to overtime!', 'For the first time in months, I told my manager I couldn''t work overtime this weekend because I had plans. They weren''t happy but they found someone else. I''m proud of myself for prioritizing my personal time!', NULL, 'celebration');

-- Note: author_id is set to NULL since we don't have real users yet
-- In production, these would reference actual user profiles
