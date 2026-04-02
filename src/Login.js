import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Login = ({ setSession }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert("लॉगिन फेल: " + error.message);
      } else {
        // App.js को सेशन पास करना, जिससे डैशबोर्ड खुलेगा
        setSession(data.session);
      }
    } catch (err) {
      // यहाँ से अलर्ट हटा दिया ताकि फालतू मैसेज न आए
      console.error("Login detail error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- प्रीमियम सेंटर लुक (Style) ---
  const containerStyle = {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', width: '100vw', backgroundColor: '#1a1a2e',
    position: 'fixed', top: 0, left: 0, margin: 0, fontFamily: 'Arial, sans-serif'
  };

  const cardStyle = {
    backgroundColor: '#fff', padding: '40px', borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.3)', textAlign: 'center',
    width: '320px', borderTop: '5px solid #d32f2f'
  };

  const inputStyle = {
    width: '100%', padding: '14px', margin: '12px 0',
    borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%', padding: '14px', backgroundColor: '#d32f2f',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
    marginTop: '20px', transition: '0.3s'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{fontSize: '40px', marginBottom: '10px'}}>🏪</div>
        <h1 style={{ color: '#d32f2f', margin: '0', fontWeight: '900', letterSpacing: '1px' }}>NM MART</h1>
        <p style={{ color: '#7f8c8d', fontSize: '12px', marginBottom: '30px', fontWeight: 'bold' }}>RETAIL OS v7.0</p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Store Email" 
            style={inputStyle} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "AUTHENTICATING..." : "SECURE LOG IN"}
          </button>
        </form>
        <p style={{marginTop: '25px', fontSize: '10px', color: '#bdc3c7'}}>Powered by NM MART Tech</p>
      </div>
    </div>
  );
};

export default Login;