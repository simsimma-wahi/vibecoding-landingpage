-- Temporarily disable RLS for development/testing
-- ⚠️ WARNING: Only use this for development! Re-enable RLS before production.

-- Disable Row Level Security
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'api_keys';
