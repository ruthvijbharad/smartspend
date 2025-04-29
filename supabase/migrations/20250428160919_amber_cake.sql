/*
  # Smart Spend Database Schema
  
  1. New Tables
    - transactions (income/expense records)
    - budgets (monthly budget settings)
    - savings (savings goals)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  amount numeric NOT NULL,
  type text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT transactions_type_check CHECK (type IN ('income', 'expense'))
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  amount numeric NOT NULL,
  month text NOT NULL,
  year integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Create savings table
CREATE TABLE IF NOT EXISTS savings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  amount numeric NOT NULL DEFAULT 0,
  target numeric NOT NULL,
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
    DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
    DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
    DROP POLICY IF EXISTS "Users can delete their own transactions" ON transactions;
    
    DROP POLICY IF EXISTS "Users can view their own budgets" ON budgets;
    DROP POLICY IF EXISTS "Users can insert their own budgets" ON budgets;
    DROP POLICY IF EXISTS "Users can update their own budgets" ON budgets;
    DROP POLICY IF EXISTS "Users can delete their own budgets" ON budgets;
    
    DROP POLICY IF EXISTS "Users can view their own savings" ON savings;
    DROP POLICY IF EXISTS "Users can insert their own savings" ON savings;
    DROP POLICY IF EXISTS "Users can update their own savings" ON savings;
    DROP POLICY IF EXISTS "Users can delete their own savings" ON savings;
END $$;

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view their own budgets"
  ON budgets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
  ON budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON budgets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON budgets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Savings policies
CREATE POLICY "Users can view their own savings"
  ON savings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings"
  ON savings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings"
  ON savings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings"
  ON savings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);