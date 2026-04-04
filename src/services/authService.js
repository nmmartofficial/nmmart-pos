import { supabase } from './supabaseClient';

export const authService = {
  // 1. लॉगिन करने के लिए (Email और Password से)
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),      // ईमेल के आगे-पीछे का स्पेस हटा देगा
        password: password.trim(),   // पासवर्ड के आगे-पीछे का स्पेस हटा देगा
      });

      if (error) {
        console.error("Login Error:", error.message);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: "Network problem, try again." };
    }
  },

  // 2. लॉगआउट करने के लिए (App से बाहर निकलने के लिए)
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout Error:", error.message);
    return { error };
  },

  // 3. यह चेक करने के लिए कि यूजर अभी लॉगिन है या नहीं
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  // 4. नया एडमिन या यूजर बनाने के लिए (Signup)
  // नोट: Supabase Dashboard में 'Confirm Email' को OFF ज़रूर कर दें
  createUser: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Signup Error:", error.message);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: "Could not create user." };
    }
  }
};