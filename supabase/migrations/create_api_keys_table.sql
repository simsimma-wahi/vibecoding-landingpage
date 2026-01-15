-- Create API keys table with user tracking
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dev', 'prod')),
  key TEXT NOT NULL UNIQUE,
  usage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create index on user_id for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);

-- Create index on type for filtering
CREATE INDEX IF NOT EXISTS idx_api_keys_type ON api_keys(type);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see and manage their own API keys
CREATE POLICY "Users can view their own API keys" ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp and updated_by user
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at and updated_by
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically set created_by on insert
CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically set created_by
CREATE TRIGGER set_api_keys_created_by
  BEFORE INSERT ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();
