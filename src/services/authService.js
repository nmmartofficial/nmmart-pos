import { supabase } from './supabaseClient';

export const authService = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Admin control: only admin can create user accounts. 
  // This usually requires a service role key or a specialized edge function.
  // For now, we'll keep it as a placeholder for the logic.
  createUser: async (email, password) => {
    // Note: Public sign-up should be disabled in Supabase settings
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }
};
