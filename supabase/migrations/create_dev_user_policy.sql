-- Alternative: Create a development policy that allows all operations
-- This keeps RLS enabled but allows unauthenticated access for development
-- ⚠️ WARNING: Only use this for development! Remove before production.

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can create their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can delete their own API keys" ON api_keys;

-- Create permissive policies for development
CREATE POLICY "Dev: Allow all operations" ON api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Note: When ready for production, drop this policy and recreate the user-specific policies
-- from create_api_keys_table.sql
