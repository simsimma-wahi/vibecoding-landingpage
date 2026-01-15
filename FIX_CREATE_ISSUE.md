# Fix: Nothing Happens When Creating API Key

## The Problem

When you try to create an API key, nothing happens because:
1. The `user_id` foreign key requires a valid user in `auth.users` table
2. The placeholder UUID doesn't exist in the auth.users table
3. The insert fails silently

## Solution: Run These SQL Commands in Supabase

Go to **Supabase Dashboard → SQL Editor** and run these in order:

### Step 1: Disable RLS
```sql
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;
```

### Step 2: Remove Foreign Key Constraint (for development)
```sql
ALTER TABLE api_keys 
DROP CONSTRAINT IF EXISTS api_keys_user_id_fkey;
```

### Step 3: Verify
```sql
-- Check that constraints are removed
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'api_keys'::regclass;
```

## Alternative: Create a Test User

If you want to keep the foreign key constraint, create a test user:

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **Add User** → **Create new user**
3. Enter email: `test@example.com`
4. Enter password: `test123456`
5. Copy the User UUID
6. Update the code to use this UUID instead of the placeholder

## After Running the Fix

1. **Restart your dev server** (stop with Ctrl+C, then `npm run dev`)
2. **Try creating an API key again**
3. **Check browser console** (F12) for any errors
4. **Check server console** for error messages

## Verify It's Working

- ✅ Create button should work
- ✅ Modal should close after creation
- ✅ New key should appear in the table
- ✅ Key should appear in Supabase Table Editor

## For Production

When ready for production, re-add the constraints:

```sql
-- Re-enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Re-add foreign key constraint
ALTER TABLE api_keys 
ADD CONSTRAINT api_keys_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```
