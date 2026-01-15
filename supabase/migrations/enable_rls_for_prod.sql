-- Re-enable RLS for production
-- Run this when you're ready to use authentication

-- Re-enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'api_keys';
