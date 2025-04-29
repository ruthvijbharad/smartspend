import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Saving = Database['public']['Tables']['savings']['Row'];
type SavingInsert = Database['public']['Tables']['savings']['Insert'];
type SavingUpdate = Database['public']['Tables']['savings']['Update'];

// Get all savings for a user
export const getSavings = async (userId: string) => {
  const { data, error } = await supabase
    .from('savings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Add a new saving
export const addSaving = async (saving: SavingInsert) => {
  const { data, error } = await supabase
    .from('savings')
    .insert(saving)
    .select()
    .single();

  return { data, error };
};

// Update a saving
export const updateSaving = async (id: string, updates: SavingUpdate) => {
  const { data, error } = await supabase
    .from('savings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

// Delete a saving
export const deleteSaving = async (id: string) => {
  const { error } = await supabase
    .from('savings')
    .delete()
    .eq('id', id);

  return { error };
};