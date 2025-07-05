# 🗄️ Database Setup Guide

## Step 1: Run SQL in Supabase

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `ydwemzpbtawiairfysdi`

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Run Schema**
   - Copy the entire content from `database/schema.sql`
   - Paste into SQL editor
   - Click "Run" button
   - ✅ Should show "Success. No rows returned"

4. **Run Sample Data**
   - Click "New Query" again
   - Copy the entire content from `database/seed-data.sql`
   - Paste into SQL editor
   - Click "Run" button
   - ✅ Should show successful inserts

## Step 2: Verify Setup

After running both SQL files, you should see these tables in your Supabase dashboard:

- `profiles`
- `glossary_terms` (with 8 sample terms)
- `scenarios` (with 4 sample scenarios)
- `scenario_choices`
- `user_glossary_progress`
- `user_scenario_completions`
- `forum_posts` (with 3 sample posts)
- `forum_comments`
- `boundary_assessments`

## Step 3: Test the App

1. **Go to your app**: http://localhost:3000
2. **Register a new account** or login
3. **Navigate to Glossary**: Should now show real data from database
4. **Try searching and filtering**: Should work with real data

## ✅ What's Now Working

- **Real Database Connection**: Glossary pulls from Supabase
- **User Profiles**: Auto-created when users sign up
- **Learning Progress**: Users can mark terms as learned
- **Secure Access**: Row Level Security protects user data
- **Sample Content**: 8 glossary terms, 4 scenarios, 3 forum posts

## 🔧 Troubleshooting

If you get errors:

1. **Permission Errors**: Make sure RLS policies are created
2. **Connection Issues**: Verify your Supabase URL/key in `.env.local`
3. **SQL Errors**: Run schema.sql first, then seed-data.sql

## 🚀 Next Steps

Once database is working:
- Build Scenarios feature
- Create Forum functionality
- Add user profile management
- Implement boundary assessment

**Let me know when you've run the SQL and if you encounter any issues!**
