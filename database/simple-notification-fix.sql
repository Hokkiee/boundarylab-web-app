-- Simple Notification System Fix
-- Run this in your Supabase SQL Editor

-- Step 1: Remove problematic trigger from notifications table only
-- (Don't drop the function since other tables use it)
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;

-- Step 2: Check current table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Step 3: Check what's currently in the notifications table
SELECT id, user_id, type, title, message, is_read, created_at 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 10;

-- Step 4: Clean up any problematic notifications with "Share" or "resonated"
DELETE FROM notifications 
WHERE message LIKE '%Share%' OR message LIKE '%resonated%';

-- Step 5: Ensure RLS is properly configured
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- Create comprehensive policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Step 6: Test the system with a simple notification
INSERT INTO notifications (user_id, type, title, message)
VALUES (
  auth.uid(),
  'system',
  'System Test',
  'Test notification - system is working!'
);

-- Step 7: Verify the test notification was created
SELECT id, type, title, message, is_read, created_at 
FROM notifications 
WHERE type = 'system' AND title = 'System Test'
ORDER BY created_at DESC 
LIMIT 1;

-- Step 8: Test marking as read
UPDATE notifications 
SET is_read = true 
WHERE type = 'system' AND title = 'System Test';

-- Step 9: Clean up test notification
DELETE FROM notifications 
WHERE type = 'system' AND title = 'System Test';

-- Step 10: Check current user info
SELECT auth.uid() as current_user_id;

-- Step 11: Final verification - check if everything is working
SELECT 
  COUNT(*) as total_notifications,
  COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count
FROM notifications 
WHERE user_id = auth.uid();
