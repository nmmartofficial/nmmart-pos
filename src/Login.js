import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function Login({ onLoginSuccess }) {
  const [shopId, setShopId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // डेटाबेस से दुकान और पासवर्ड मैच करना
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .eq('password', password) // सुनिश्चित करें कि 'password' कॉलम टेबल में है
      .single();

    if (data) {
      onLoginSuccess(data);
    } else {
      alert("Invalid ID or Password!");
    }
    setLoading(false);
  };

  return (
    <div style={loginContainer}>
      <div style={loginCard}>
        <h1 style={{ color: '#1a1a2e', marginBottom: '10px' }}>NM MART RETAIL OS</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Enter your credentials to manage your store</p>
        
        <form onSubmit={handleLogin}>
          <div style={inputGroup}>
            <label>Shop ID</label>
            <input type="text" value={shopId} onChange={(e) => setShopId(e.target.value)} style={inputStyle} placeholder="Enter Shop ID" required />
          </div>
          <div style={inputGroup}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} style={loginBtn}>
            {loading ? 'Authenticating...' : 'LOGIN TO DASHBOARD'}
          </button>
        </form>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#bdc3c7' }}>Powered by NM Mart Technology</div>
      </div>
    </div>
  );
}

// --- Styles ---
const loginContainer = { display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' };
const loginCard = { background: '#fff', padding: '50px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', width: '400px' };
const inputGroup = { textAlign: 'left', marginBottom: '20px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' };
const loginBtn = { width: '100%', padding: '15px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };

export default Login;