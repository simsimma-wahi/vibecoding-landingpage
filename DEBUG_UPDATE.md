# Debug: Update Not Working

## Quick Checklist

### 1. Check Browser Console (F12)
When you click "Update", check the console for:
- ✅ "Updating API key: [id] with data: [data]"
- ✅ "Update response status: [status]"
- ❌ Any error messages

### 2. Check Server Console
In the terminal where `npm run dev` is running, look for:
- ✅ "PUT request received for ID: [id]"
- ✅ "Update data: { name, type }"
- ❌ Any error messages

### 3. Verify Database Setup
Make sure you ran these SQL commands in Supabase:

```sql
-- Disable RLS
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;

-- Remove foreign key constraint
ALTER TABLE api_keys 
DROP CONSTRAINT IF EXISTS api_keys_user_id_fkey;
```

## Common Errors & Solutions

### Error: "Row Level Security is enabled"
**Solution**: Run `ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;` in Supabase

### Error: "Foreign key constraint violation"
**Solution**: Run the DROP CONSTRAINT command above

### Error: "API key not found"
**Possible causes**:
- The key ID doesn't match
- The key was deleted
- RLS is filtering it out

### Error: "Failed to update API key"
**Check**:
- Browser console for full error message
- Server console for detailed error
- Network tab (F12 → Network) to see the API response

## Test Steps

1. Open browser console (F12)
2. Click edit icon on an API key
3. Change the name
4. Click "Update"
5. Watch console for:
   - Request being sent
   - Response status
   - Any error messages

## Manual Test

You can test the API directly:

```bash
# Replace [KEY_ID] with an actual key ID from your database
curl -X PUT http://localhost:3000/api/keys/[KEY_ID] \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Update","type":"dev"}'
```

This will show you the exact error from the API.
