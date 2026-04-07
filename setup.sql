-- Run this SQL in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT DEFAULT 'NM MART',
  license_valid_until DATE DEFAULT '2027-04-01',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
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

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  barcode TEXT UNIQUE,
  category TEXT,
  purchase_price NUMERIC(10, 2) NOT NULL,
  sale_price NUMERIC(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "User can view their own products." ON products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert their own products." ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update their own products." ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "User can delete their own products." ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "User can view their own customers." ON customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert their own customers." ON customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update their own customers." ON customers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "User can delete their own customers." ON customers
  FOR DELETE USING (auth.uid() = user_id);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  gst_amount NUMERIC(10, 2) NOT NULL,
  payment_mode TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for sales
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies for sales
CREATE POLICY "User can view their own sales." ON sales
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert their own sales." ON sales
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update their own sales." ON sales
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "User can delete their own sales." ON sales
  FOR DELETE USING (auth.uid() = user_id);

-- Create sales_items table
CREATE TABLE IF NOT EXISTS sales_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  gst_rate NUMERIC(5, 2) NOT NULL,
  gst_amount NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for sales_items
ALTER TABLE sales_items ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_items
CREATE POLICY "User can view their own sales items." ON sales_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM sales WHERE sales.id = sales_items.sale_id AND sales.user_id = auth.uid()));

CREATE POLICY "User can insert their own sales items." ON sales_items
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM sales WHERE sales.id = sales_items.sale_id AND sales.user_id = auth.uid()));

CREATE POLICY "User can update their own sales items." ON sales_items
  FOR UPDATE USING (EXISTS (SELECT 1 FROM sales WHERE sales.id = sales_items.sale_id AND sales.user_id = auth.uid()));

CREATE POLICY "User can delete their own sales items." ON sales_items
  FOR DELETE USING (EXISTS (SELECT 1 FROM sales WHERE sales.id = sales_items.sale_id AND sales.user_id = auth.uid()));

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses
CREATE POLICY "User can view their own expenses." ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert their own expenses." ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update their own expenses." ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "User can delete their own expenses." ON expenses
  FOR DELETE USING (auth.uid() = user_id);
