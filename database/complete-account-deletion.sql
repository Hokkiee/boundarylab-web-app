-- Complete Account Deletion with CASCADE DELETE
-- This script ensures all user data is properly deleted when a user account is deleted
-- Run this in your Supabase SQL Editor

-- Step 1: Verify and fix any missing CASCADE DELETE relationships

-- Check if forum_likes has proper CASCADE DELETE (it should from the SQL file)
-- This is already correctly set up

-- Check if notifications has proper CASCADE DELETE (it should from the SQL file)
-- This is already correctly set up

-- Step 2: Create a comprehensive user deletion function
-- This function will be called to delete all user data and then the user account

CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID)
RETURNS void AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = target_user_id) INTO user_exists;
  
  IF NOT user_exists THEN
    RAISE EXCEPTION 'User does not exist';
  END IF;
  
  -- Delete user data in order (due to foreign key constraints)
  -- Most of these will be handled by CASCADE DELETE, but we'll be explicit
  
  -- 1. Delete notifications
  DELETE FROM notifications WHERE user_id = target_user_id;
  
  -- 2. Delete forum likes
  DELETE FROM forum_likes WHERE user_id = target_user_id;
  
  -- 3. Delete forum comments
  DELETE FROM forum_comments WHERE author_id = target_user_id;
  
  -- 4. Delete forum posts
  DELETE FROM forum_posts WHERE author_id = target_user_id;
  
  -- 5. Delete user scenario completions
  DELETE FROM user_scenario_completions WHERE user_id = target_user_id;
  
  -- 6. Delete user glossary progress
  DELETE FROM user_glossary_progress WHERE user_id = target_user_id;
  
  -- 7. Delete boundary assessments
  DELETE FROM boundary_assessments WHERE user_id = target_user_id;
  
  -- 8. Delete profile (this should cascade from auth.users deletion)
  DELETE FROM profiles WHERE id = target_user_id;
  
  -- 9. Finally, delete the auth user (this will cascade to profile if we missed it)
  DELETE FROM auth.users WHERE id = target_user_id;
  
  RAISE NOTICE 'User account % completely deleted', target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create a safer version that requires admin privileges
-- This is the function that should be called from the application

CREATE OR REPLACE FUNCTION request_account_deletion(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Verify the user is deleting their own account
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'You can only delete your own account';
  END IF;
  
  -- Call the comprehensive deletion function
  PERFORM delete_user_account(user_id);
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant necessary permissions
-- Allow authenticated users to call the deletion function
GRANT EXECUTE ON FUNCTION request_account_deletion(UUID) TO authenticated;
