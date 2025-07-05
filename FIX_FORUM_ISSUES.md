# Fix for Forum Post Creation Issues

## Root Cause Analysis

The forum post creation was failing due to foreign key constraint violations. Specifically:

1. **Missing User Profiles**: When users register, their profile wasn't being automatically created in the `profiles` table
2. **Foreign Key Violations**: Forum posts require a valid `author_id` that references the `profiles` table
3. **RLS Policy Issues**: Row Level Security policies were too restrictive for profile creation

## Step-by-Step Fix

### 1. Run Database Migration

Execute the migration script in your Supabase SQL Editor:

```bash
# Copy and paste the contents of database/fix-foreign-keys.sql
# into your Supabase SQL Editor and run it
```

This will:
- Create profiles for existing users who don't have them
- Add an auto-trigger to create profiles for new users
- Fix RLS policies
- Check for orphaned data

### 2. Verify the Fix

After running the migration:

1. Try creating a new forum post
2. Check that the post appears in the forum list
3. Verify that user profiles are being created automatically

### 3. Environment Check

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test User Flow

1. Register a new user
2. Verify their profile is automatically created
3. Try creating a forum post
4. Confirm the post shows up in the forum

## Prevention

The trigger function `handle_new_user()` will now automatically create a profile for every new user, preventing this issue from happening again.

## Rollback Plan

If you need to rollback:

1. Remove the trigger:
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   ```

2. Restore original RLS policies from the original schema.sql file

## Monitoring

Check the Supabase logs for any remaining errors. The improved error handling in the API will now provide better error messages for debugging.
