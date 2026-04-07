-- Run this SQL in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT DEFAULT 'NM MART',
  license_valid_until DATE DEFAULT '2027-04-01',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insert data for the Owner ID
INSERT INTO profiles (id, business_name, license_valid_until)
VALUES ('02dd7b9d-aded-4207-97d8-b586facb40b5', 'NM MART', '2027-04-01')
ON CONFLICT (id) DO UPDATE 
SET business_name = EXCLUDED.business_name, 
    license_valid_until = EXCLUDED.license_valid_until;
