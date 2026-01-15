# How to Start and Test the App

## Step 1: Disable RLS in Supabase

1. Go to your **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Paste this SQL:
   ```sql
   ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;
   ```
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see: "Success. No rows returned"

## Step 2: Install Dependencies (if not done)

```bash
cd emeth
npm install
```

## Step 3: Start the Development Server

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 16.1.1
- Local:        http://localhost:3000
```

## Step 4: Open the App

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the home page

## Step 5: Test the API Keys Dashboard

1. Click the **"API Keys Dashboard"** button
2. You should see the dashboard with the API Keys table
3. Click the **"+"** button to create a new API key
4. Enter a name (e.g., "Test Key")
5. Select type (dev or prod)
6. Click **"Create"**

## Step 6: Verify It Works

✅ **Create Test**:
- Create an API key
- Should see success toast
- Key should appear in the table

✅ **Read Test**:
- See all your API keys in the table
- Each key shows: Name, Type, Usage, Key (masked), Options

✅ **Update Test**:
- Click the **pencil icon** (edit) on a key
- Change the name or type
- Click **"Update"**
- Changes should reflect immediately

✅ **Delete Test**:
- Click the **trash icon** (delete) on a key
- Confirm deletion in the modal
- Key should be removed from the table

✅ **Check Supabase**:
- Go to Supabase Dashboard → **Table Editor** → `api_keys`
- You should see your created keys there

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### "Failed to fetch API keys" error?
- ✅ Check `.env.local` has correct Supabase credentials
- ✅ Restart the dev server after changing `.env.local`
- ✅ Verify RLS is disabled in Supabase

### "User must be authenticated" error?
- ✅ Make sure you ran: `ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;`
- ✅ Check Supabase SQL Editor to verify RLS is disabled

### Still having issues?
- Check browser console (F12) for errors
- Check terminal/console for server errors
- Verify Supabase project is active (not paused)

## Quick Commands Reference

```bash
# Navigate to project
cd emeth

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
