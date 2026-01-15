# Supabase Integration Setup

This project uses Supabase as the database for storing API keys.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be set up (takes a few minutes)

### 3. Get Your Supabase Credentials

1. Go to your project settings
2. Navigate to **API** section
3. Copy the following:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 4. Set Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Create the Database Table

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/create_api_keys_table.sql`
5. Click **Run** to execute the migration

Alternatively, you can use the Supabase CLI:
```bash
supabase db push
```

### 6. Verify the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard and try creating an API key
3. Check your Supabase dashboard → **Table Editor** → `api_keys` to see the data

## Database Schema

The `api_keys` table has the following structure:

- `id` (TEXT, PRIMARY KEY) - Unique identifier for the API key
- `user_id` (UUID, NOT NULL) - Foreign key to `auth.users(id)` - Owner of the API key
- `name` (TEXT, NOT NULL) - Name/label for the API key
- `type` (TEXT, NOT NULL) - Type of key: 'dev' or 'prod'
- `key` (TEXT, NOT NULL, UNIQUE) - The actual API key value
- `usage` (INTEGER, DEFAULT 0) - Usage counter
- `created_at` (TIMESTAMPTZ) - Creation timestamp (auto-set)
- `created_by` (UUID) - User who created the key (auto-set by trigger)
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)
- `updated_by` (UUID) - User who last updated the key (auto-updated by trigger)

## Security Notes

- **Row Level Security (RLS) is enabled** - Users can only see and manage their own API keys
- The RLS policies automatically filter queries by the authenticated user's ID
- All CRUD operations require user authentication
- The `anon` key is safe to use in the browser, but RLS policies ensure data isolation
- `created_by` and `updated_by` fields are automatically set by database triggers
- When a user is deleted, their API keys are automatically deleted (CASCADE)

## Authentication Setup

To use this API with user authentication:

1. **Enable Supabase Auth** in your Supabase project
2. **Set up authentication** in your frontend (email/password, OAuth, etc.)
3. **Pass the user session** to the API routes via cookies or headers
4. The RLS policies will automatically enforce that users can only access their own keys

For development/testing without authentication, you can temporarily modify the RLS policies, but this is **NOT recommended for production**.

## Troubleshooting

### "Failed to fetch API keys" error
- Check that your environment variables are set correctly
- Verify the Supabase URL and anon key are correct
- Ensure the `api_keys` table exists in your Supabase database

### "API key not found" error
- Check that the table was created successfully
- Verify RLS policies allow read/write operations
- Check the browser console and server logs for detailed error messages

