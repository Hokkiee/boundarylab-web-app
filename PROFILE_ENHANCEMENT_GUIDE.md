# Enhanced Profile System Setup Guide

## Overview

The enhanced profile system includes:
- ✨ **Spark System**: Users can send "sparks" to appreciate others' forum posts
- 📝 **Reflection Journal**: Private diary with option to share reflections publicly  
- 👤 **Enhanced Profiles**: Bio, job title, motto, profile picture, and spark count
- 🔔 **Notifications**: Get notified when receiving sparks
- 📱 **Profile Modal**: View other users' profiles from forum posts (clickable profile pictures)

## Setup Steps

### 1. Run Database Migrations

First, apply the foreign key fixes:
```sql
-- Run fix-foreign-keys.sql in Supabase SQL Editor
```

Then, apply the profile enhancements:
```sql
-- Run profile-enhancements.sql in Supabase SQL Editor  
```

### 2. Setup Storage Bucket for Profile Pictures

In your Supabase dashboard:

1. **Go to Storage** → Create new bucket
2. **Name it**: `profile-pictures`
3. **Make it public**: ✅ Public bucket
4. **Add storage policies**:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Users can upload profile pictures" ON storage.objects
   FOR INSERT TO authenticated WITH CHECK (
     bucket_id = 'profile-pictures' AND 
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Allow public read access
   CREATE POLICY "Profile pictures are publicly accessible" ON storage.objects
   FOR SELECT TO public USING (bucket_id = 'profile-pictures');

   -- Allow users to update their own
   CREATE POLICY "Users can update own profile pictures" ON storage.objects
   FOR UPDATE TO authenticated USING (
     bucket_id = 'profile-pictures' AND 
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

### 3. Test the System

1. **Profile Management**:
   - Go to Profile tab
   - Edit your profile info (bio, job title, motto, profile picture)
   - Complete a scenario and check reflection journal

2. **Spark System**:
   - Create a forum post
   - Click on someone's profile picture in forum posts
   - Send/receive sparks from the profile modal
   - Check notifications

3. **Privacy Controls**:
   - Make some reflections public/private
   - View your profile from another user's perspective
   - Upload and update profile pictures

4. **Storage Bucket**:
   - Upload a profile picture
   - Check public access to the profile picture
   - Update the profile picture and verify the change

## Features Breakdown

### Spark System
- **One spark per person per post** (prevents spam)
- **Shows sender identity** (builds community trust)
- **Real-time notifications** when receiving sparks
- **Spark count displayed** on profiles

### Reflection Journal  
- **Private by default** with option to make public
- **Editable reflections** (like a personal diary)
- **Scenario context** shows which scenario the reflection is from
- **Date sorting** (newest first)

### Enhanced Profiles
- **Two views**: Own profile (full) vs. others' profile (modal)
- **Editable info**: Display name, bio, job title, motto, profile picture
- **Spark count**: Shows community appreciation
- **Recent content**: Shows public reflections and forum posts
- **Profile pictures**: Upload and display custom profile photos

### Profile Modal
- **Triggered from forum**: Click profile picture → modal opens
- **Community connection**: Send sparks, view public content
- **Respectful design**: Only shows what user chose to share

## Database Tables Added

1. **user_sparks**: Tracks who sparked what post
2. **user_reflections**: Manages reflection privacy settings  
3. **notifications**: Spark notifications and future notification types
4. **profiles**: Extended with job_title, motto, spark_count

## Next Phase Ideas

For future enhancements:
- **Spark analytics**: Weekly/monthly spark summaries
- **Community badges**: Recognition for helpful members
- **Reflection sharing**: Dedicated reflection sharing feed
- **Follow system**: Evolution from sparks to following
- **Direct messaging**: Private conversations between users

## Troubleshooting

**Common Issues**:
1. **Profile not loading**: Check if user profile was created (auto-trigger should handle this)
2. **Can't send spark**: Check if user already sparked that specific post
3. **Reflections not showing**: Verify user has completed scenarios with reflections
4. **Modal not opening**: Ensure ProfileModal component is imported in ForumPage
5. **Profile picture issues**: Check storage bucket policies and file uploads

**Debug Steps**:
1. Check browser console for API errors
2. Verify Supabase RLS policies allow expected operations
3. Test with different user accounts to verify cross-user functionality
4. Inspect storage bucket settings and uploaded file permissions
