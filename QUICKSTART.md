# Quick Start Guide

Follow these steps to run the API Keys Dashboard application.

## Prerequisites

- Node.js installed (v18 or higher)
- A Supabase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd emeth
npm install
```

### 2. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name (e.g., "emeth-api-keys")
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

### 3. Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

### 4. Set Environment Variables

Create a `.env.local` file in the `emeth` directory:

```bash
cd emeth
touch .env.local
```

Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials!

### 5. Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `supabase/migrations/create_api_keys_table.sql` in your editor
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### 6. (Optional) Disable RLS for Development

**⚠️ Only for development/testing!**

If you want to test without authentication, temporarily disable RLS:

1. Go to **SQL Editor** in Supabase
2. Run this query:
```sql
-- Temporarily disable RLS for development
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;
```

**Remember to re-enable RLS before production:**
```sql
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
```

### 7. Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.1.1
- Local:        http://localhost:3000
```

### 8. Open the Application

1. Open your browser and go to: **http://localhost:3000**
2. Click the **"API Keys Dashboard"** button
3. Try creating an API key!

## Verify Everything Works

1. **Create an API key**:
   - Click "+" button
   - Enter a name (e.g., "Test Key")
   - Select type (dev or prod)
   - Click "Create"

2. **Check Supabase**:
   - Go to Supabase dashboard → **Table Editor** → `api_keys`
   - You should see your newly created API key

3. **Test CRUD operations**:
   - ✅ Create: Add a new API key
   - ✅ Read: See all your API keys in the table
   - ✅ Update: Click edit icon, change name/type, click Update
   - ✅ Delete: Click delete icon, confirm deletion

## Troubleshooting

### "Failed to fetch API keys" error

- ✅ Check `.env.local` file exists and has correct values
- ✅ Restart the dev server after creating `.env.local`
- ✅ Verify Supabase project is active (not paused)

### "User must be authenticated" error

- ✅ You disabled RLS (see step 6 above), OR
- ✅ Set up Supabase Auth and authenticate users

### "Table does not exist" error

- ✅ Make sure you ran the SQL migration (step 5)
- ✅ Check Supabase → Table Editor to see if `api_keys` table exists

### Port 3000 already in use

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Next Steps

- Set up authentication with Supabase Auth
- Customize the UI/UX
- Add more features (usage tracking, rate limiting, etc.)
- Deploy to production (Vercel, Netlify, etc.)

## Need Help?

- Check `README_SUPABASE.md` for detailed documentation
- Check browser console (F12) for errors
- Check terminal/console for server errors
- Supabase logs: Dashboard → Logs
