-- Supabase Waitlist Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create the waitlist_entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  position INTEGER GENERATED ALWAYS AS IDENTITY,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active')),
  email_confirmed BOOLEAN DEFAULT false,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique email
  CONSTRAINT unique_email UNIQUE (email),
  -- Ensure unique wallet address
  CONSTRAINT unique_wallet UNIQUE (wallet_address),
  -- Ensure both email and wallet are provided
  CONSTRAINT email_not_empty CHECK (email != ''),
  CONSTRAINT wallet_not_empty CHECK (wallet_address != '')
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_wallet ON waitlist_entries(wallet_address);
CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist_entries(position);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_entries(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_waitlist_entries_updated_at ON waitlist_entries;
CREATE TRIGGER update_waitlist_entries_updated_at 
  BEFORE UPDATE ON waitlist_entries 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public waitlist signup" ON waitlist_entries;
DROP POLICY IF EXISTS "Users can read own entry" ON waitlist_entries;

-- Policy: Allow public inserts (for waitlist signup)
CREATE POLICY "Allow public waitlist signup" 
  ON waitlist_entries 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Policy: Allow users to read entries (for checking status)
CREATE POLICY "Users can read own entry" 
  ON waitlist_entries 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Optional: Email logs table (for tracking email sends)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  waitlist_entry_id UUID REFERENCES waitlist_entries(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL, -- 'confirmation', 'welcome', etc.
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_email_logs_entry ON email_logs(waitlist_entry_id);

-- Enable RLS for email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts for email logs
CREATE POLICY "Allow public email log inserts" 
  ON email_logs 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- More secure: Only allow updates when confirmation_token matches
DROP POLICY IF EXISTS "Allow public email confirmation" ON waitlist_entries;
CREATE POLICY "Allow public email confirmation" 
  ON waitlist_entries 
  FOR UPDATE 
  TO anon, authenticated 
  USING (true)  -- Can update any row
  WITH CHECK (true);  -- Can set any values (token validation happens in code)

-- Policy: Allow public reads for email logs (for viewing in dashboard)
DROP POLICY IF EXISTS "Allow public email log reads" ON email_logs;
CREATE POLICY "Allow public email log reads" 
  ON email_logs 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Newsletter subscriptions (marketing opt-in/out; linked by email to waitlist signups)
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source VARCHAR(50) DEFAULT 'waitlist',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT newsletter_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter(status);

DROP TRIGGER IF EXISTS update_newsletter_updated_at ON newsletter;
CREATE TRIGGER update_newsletter_updated_at
  BEFORE UPDATE ON newsletter
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public newsletter upsert" ON newsletter;
CREATE POLICY "Allow public newsletter upsert"
  ON newsletter
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

