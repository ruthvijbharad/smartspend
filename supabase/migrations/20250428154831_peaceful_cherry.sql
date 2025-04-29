/*
  # Initial Smart Spend database schema
  
  1. New Tables
    - `transactions` - Stores all income and expense transactions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric, transaction amount)
      - `type` (text, 'income' or 'expense')
      - `category` (text, transaction category)
      - `description` (text, transaction description)
      - `date` (date, transaction date)
      - `created_at` (timestamp with timezone)
    
    - `budgets` - Stores monthly budget settings
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric, budget amount)
      - `month` (text, budget month)
      - `year` (integer, budget year)
      - `created_at` (timestamp with timezone)
    
    - `savings` - Stores savings goals
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric, current amount saved)
      - `target` (numeric, target amount)
      - `title` (text, goal title)
      - `created_at` (timestamp with timezone)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for users to access only their own data
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  month text NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, month, year)
);

-- Create savings table
CREATE TABLE IF NOT EXISTS savings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  target numeric NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
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

-- Create policies for budgets
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

-- Create policies for savings
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