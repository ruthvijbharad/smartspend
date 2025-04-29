import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Budget = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
type BudgetUpdate = Database['public']['Tables']['budgets']['Update'];

// Get budget for the current month
export const getCurrentBudget = async (userId: string) => {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' }).toLowerCase();
  const year = now.getFullYear();

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)
    .maybeSingle();

  return { data, error };
};

// Set or update budget
export const setBudget = async (budget: BudgetInsert) => {
  // Check if budget already exists
  const { data: existingBudget } = await supabase
    .from('budgets')
    .select('id')
    .eq('user_id', budget.user_id)
    .eq('month', budget.month)
    .eq('year', budget.year)
    .maybeSingle();

  if (existingBudget) {
    // Update existing budget
    const { data, error } = await supabase
      .from('budgets')
      .update({ amount: budget.amount })
      .eq('id', existingBudget.id)
      .select()
      .single();

    return { data, error };
  } else {
    // Create new budget
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single();

    return { data, error };
  }
};