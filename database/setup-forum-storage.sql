-- Setup storage policies for forum images
-- IMPORTANT: You cannot run this SQL directly due to permission restrictions
-- Instead, follow these steps in your Supabase Dashboard:

/*
STEP 1: Create the bucket
1. Go to Storage > Buckets
2. Click "Create bucket"
3. Name: forum-images
4. Make it PUBLIC (check the box)
5. Click "Create bucket"

STEP 2: Set up policies via Dashboard
1. Go to Storage > Policies
2. Find the "forum-images" bucket section
3. Click "New policy" and create these policies:

Policy 1: "Allow authenticated uploads"
- Policy name: Allow authenticated uploads
- Target roles: authenticated
- Allowed operations: INSERT
- Policy definition: bucket_id = 'forum-images'

Policy 2: "Allow public access"
- Policy name: Allow public access
- Target roles: public
- Allowed operations: SELECT
- Policy definition: bucket_id = 'forum-images'

Policy 3: "Allow authenticated deletes" (optional)
- Policy name: Allow authenticated deletes
- Target roles: authenticated
- Allowed operations: DELETE
- Policy definition: bucket_id = 'forum-images'
*/

-- Alternative: If you have service role key, you can try these commands:
-- But typically you should use the dashboard approach above

-- INSERT INTO storage.buckets (id, name, public) VALUES ('forum-images', 'forum-images', true);

-- Note: Storage policies are typically managed through the Supabase Dashboard
-- The SQL approach often fails due to permission restrictions
