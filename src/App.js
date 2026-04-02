import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [session, setSession] = useState(null);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    // 1. चेक करें कि यूजर लॉगिन है या नहीं
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchShopData(session.user.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchShopData(session.user.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. 'shops' टेबल से दुकानदार का डेटा लाना (NM MART का डेटा यहाँ से आएगा)
  async function fetchShopData(email) {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_email', email)
      .single();

    if (!error && data) {
      setShop(data);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setShop(null);
  };

  // --- स्क्रीन रेंडरिंग ---
  return (
    <div className="App">
      {!session ? (
        // अगर लॉगिन नहीं है तो Login.js दिखेगा
        <Login /> 
      ) : shop ? (
        // अगर लॉगिन है तो Dashboard.js दिखेगा और उसे 'shop' का डेटा मिलेगा
        <Dashboard shop={shop} onLogout={handleLogout} />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          शॉप डेटा लोड हो रहा है... कृपया अपनी 'shops' टेबल में ईमेल चेक करें।
        </div>
      )}
    </div>
  );
}

export default App;