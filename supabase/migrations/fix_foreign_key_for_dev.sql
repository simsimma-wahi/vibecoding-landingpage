-- Fix foreign key constraint for development
-- This allows inserting with any UUID without requiring a real user

-- Drop the foreign key constraint temporarily
ALTER TABLE api_keys 
DROP CONSTRAINT IF EXISTS api_keys_user_id_fkey;

-- Re-add it but make it deferrable (allows invalid references during transaction)
-- Or remove it completely for development
-- For development, we'll just remove the constraint
-- ALTER TABLE api_keys 
-- ADD CONSTRAINT api_keys_user_id_fkey 
-- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For production, you should re-add the constraint:
-- ALTER TABLE api_keys 
-- ADD CONSTRAINT api_keys_user_id_fkey 
-- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
