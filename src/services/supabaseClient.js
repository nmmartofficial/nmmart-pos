import { createClient } from '@supabase/supabase-js';

// Optimizing for high-performance Retail OS
const supabaseUrl = 'https://lxdqygldjjbgpzpklbns.supabase.co';
const supabaseAnonKey = 'sb_publishable_Y1d7P8E-IH-IfVI1tOb3NQ_zZSs5-yc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'x-application-name': 'nm-mart-retail-os' },
  },
});

// Optimized data fetching helper
export const fastFetch = async (table, query = '*') => {
  const { data, error } = await supabase
    .from(table)
    .select(query)
    .limit(1)
    .single();
  
  if (error) throw error;
  return data;
};