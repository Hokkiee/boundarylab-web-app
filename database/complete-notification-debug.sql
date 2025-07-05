-- Complete Notification System Debug and Fix
-- Run this in your Supabase SQL Editor

-- Step 1: Check what's currently in the notifications table
SELECT id, user_id, type, title, message, is_read, created_at 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 10;

-- Step 2: Check if there are any notifications with "Share" in the message
SELECT id, title, message, created_at 
FROM notifications 
WHERE message LIKE '%Share%' OR message LIKE '%resonated%'
ORDER BY created_at DESC;

-- Step 3: Clean up any problematic notifications
DELETE FROM notifications 
WHERE message LIKE '%Share%' OR message LIKE '%resonated%';

-- Step 4: Check table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Step 5: Ensure proper RLS setup
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop and recreate all policies
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

-- Step 6: Create a test notification to verify the system works
INSERT INTO notifications (user_id, type, title, message)
VALUES (
  auth.uid(),
  'system',
  'System Test',
  'This is a test notification to verify the system is working properly.'
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

-- Step 10: Check current user ID for debugging
SELECT auth.uid() as current_user_id;

-- Step 11: Check profiles table to ensure user exists
SELECT id, email, display_name FROM profiles WHERE id = auth.uid();
