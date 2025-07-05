-- Strict RLS Policies for BoundaryLab (Production)
-- Run this AFTER schema.sql for a more secure setup where all access requires authentication
-- This is the default configuration already included in schema.sql

-- Note: The schema.sql file already includes these policies, but they're listed here for reference:

-- 1. Profiles
--    ✅ Anyone can view profiles
--    ✅ Users can only update their own profile

-- 2. Glossary Terms  
--    ✅ Only authenticated users can read published terms
--    ❌ Anonymous users cannot access

-- 3. Scenarios
--    ✅ Only authenticated users can read published scenarios
--    ❌ Anonymous users cannot access

-- 4. Forum Posts
--    ✅ Only authenticated users can read published posts
--    ✅ Only authenticated users can create posts
--    ✅ Users can only edit their own posts
--    ❌ Anonymous users cannot access

-- 5. User Progress & Assessments
--    ✅ Users can only access their own data
--    ❌ No public access

-- These policies are already applied when you run schema.sql
-- No additional SQL needed for strict authentication-required access

-- If you previously ran rls-public-access.sql and want to revert to strict mode,
-- simply drop and recreate your database tables by running schema.sql again.
