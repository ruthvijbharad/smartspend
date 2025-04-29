import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

// Get all transactions for a user
export const getTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  return { data, error };
};

// Add a new transaction
export const addTransaction = async (transaction: TransactionInsert) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();

  return { data, error };
};

// Update a transaction
export const updateTransaction = async (id: string, updates: TransactionUpdate) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

// Delete a transaction
export const deleteTransaction = async (id: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  return { error };
};

// Get transactions by date range
export const getTransactionsByDateRange = async (userId: string, startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  return { data, error };
};