// AuthContext.js में पूरा पेस्ट करें
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  // Optimized profile fetching for Retail OS
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('business_name, license_valid_until, is_active')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
        const today = new Date();
        const expiryDate = new Date(data.license_valid_until);
        setIsExpired(today > expiryDate || data.is_active === false);
        return data;
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    }
    return null;
  };

  useEffect(() => {
    // Safety timeout: Ensure loading stops
    const timer = setTimeout(() => setLoading(false), 3000);

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timer);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isExpired, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);