# Forum Functionality Database Setup

The forum functionality requires proper database tables and RLS policies. Follow these steps to resolve all issues:

## 🔧 Quick Fix (Recommended)

1. **Open your Supabase dashboard**
2. **Go to the SQL Editor**
3. **Run these scripts in order:**

   **Step 1 - Create tables and functions:**
   ```sql
   -- Copy and paste contents of: database/fix-forum-complete.sql
   ```

   **Step 2 - Fix RLS policies:**
   ```sql
   -- Copy and paste contents of: database/fix-rls-policies.sql
   ```

## 🚨 Common Issues & Solutions

### Issue 1: "406 Not Acceptable" Errors
**Cause:** Restrictive RLS policies blocking forum access
**Fix:** Run `database/fix-rls-policies.sql`

### Issue 2: "relation does not exist" Errors  
**Cause:** Missing forum_likes table or images column
**Fix:** Run `database/fix-forum-complete.sql`

### Issue 3: Heart buttons don't work
**Cause:** Missing forum_likes table and functions
**Fix:** Run both setup scripts above

### Issue 4: Profile information not showing
**Cause:** Restrictive profile RLS policies
**Fix:** RLS policies script includes profile fixes

## 📋 What Gets Fixed

### Database Tables:
- ✅ **forum_likes table**: Stores user likes for posts  
- ✅ **Images column**: Adds image support to forum posts
- ✅ **Database functions**: `increment_post_upvotes` and `decrement_post_upvotes`

### RLS Policies:
- ✅ **Public forum access**: Anyone can view published posts
- ✅ **Authenticated actions**: Only logged-in users can like/create posts
- ✅ **Profile visibility**: Profiles are publicly viewable for forum display
- ✅ **Security**: Users can only modify their own content

### Performance:
- ✅ **Indexes**: Optimized database queries
- ✅ **Efficient joins**: Proper table relationships

## 🧪 Verify Setup

After running both scripts, you should see:
- ✅ Forum loads without 406 errors
- ✅ Posts display with author information  
- ✅ Heart buttons work (like/unlike)
- ✅ Like counts update in real-time
- ✅ No console errors related to forum functionality

## 🔍 Troubleshooting Commands

Check if tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('forum_posts', 'forum_likes', 'profiles');
```

Check RLS policies:
```sql
SELECT tablename, policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename IN ('forum_posts', 'forum_likes', 'profiles');
```

## 📚 Individual Setup Files

If you prefer step-by-step setup:
1. **Basic schema:** `database/schema.sql`
2. **Add images:** `database/add-forum-images.sql`  
3. **Add likes:** `database/create-forum-likes.sql`
4. **Fix policies:** `database/fix-rls-policies.sql`

## 🛡️ Security Notes

The new RLS policies balance functionality with security:
- **Forum posts**: Public read, authenticated write
- **Likes**: Public read, authenticated write (own likes only)  
- **Profiles**: Public read, authenticated write (own profile only)

This allows the forum to work properly while maintaining appropriate access controls.
