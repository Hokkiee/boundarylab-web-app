# Supabase Setup Guide

This app is currently running in **demo mode** with sample data. To connect to a real Supabase database and enable persistent data storage, follow these steps:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be fully set up

## 2. Set Up the Database Schema

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Run the `database/schema.sql` file to create all necessary tables
4. Run the `database/seed-data.sql` file to add sample data

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the "Project URL" and "anon public" key

3. Edit the `.env` file and replace the placeholder values:
   ```bash
   VITE_SUPABASE_URL=your_actual_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   ```

## 4. Restart the Development Server

After setting up the environment variables, restart your development server:

```bash
npm run dev
```

## 5. Configure Row Level Security (RLS)

The database schema already includes RLS policies, but you can choose your security level:

### Option A: Public Access (Recommended for Demo)
Run this to allow anonymous browsing of content:
```sql
-- Copy and paste the contents of database/rls-public-access.sql
-- into your Supabase SQL Editor
```

**Benefits:**
- ✅ Forum posts visible without login
- ✅ Glossary accessible to everyone  
- ✅ Scenarios work without authentication
- ✅ Still secure - only authenticated users can create/edit content

### Option B: Authenticated Only (Production)
The default schema.sql already sets this up - no additional action needed.

**Benefits:**
- 🔒 More secure - requires login for all access
- 🔒 Content only visible to registered users
- ❌ Forum won't work for anonymous visitors

### Manual RLS Configuration (Alternative)
If you prefer to set up RLS manually:

1. Go to Authentication → Policies in your Supabase dashboard
2. Enable RLS for each table
3. Copy the policies from `database/rls-public-access.sql` or use the defaults in `schema.sql`

## Troubleshooting

- **"Demo Mode" banner still shows**: Make sure your `.env` file is in the root directory and restart the dev server
- **No forum posts appear**: Check that you've run `seed-data.sql` and consider running `rls-public-access.sql` for anonymous access
- **Can't create posts**: Ensure you're logged in and RLS policies allow writes for authenticated users
- **"Row Level Security" errors**: Run `database/rls-public-access.sql` to allow anonymous browsing, or ensure users are authenticated for strict mode

## RLS Policy Files

- **`database/schema.sql`** - Creates tables with strict RLS (authentication required)
- **`database/rls-public-access.sql`** - Allows anonymous reading of content (recommended for demo)
- **`database/rls-authenticated-only.sql`** - Reference for strict authentication-only policies

## Database Tables Created

The schema creates these main tables:
- `profiles` - User profiles
- `glossary_terms` - Boundary-related terms and definitions
- `scenarios` - Interactive scenarios with choices
- `forum_posts` - Community forum posts
- `user_glossary_progress` - User learning progress
- `user_scenario_completions` - User scenario progress

Once configured, your app will display real data from these tables instead of the sample data.
