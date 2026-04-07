import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // High-speed sign-in logic
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Specifically handling the email confirmation issue
        if (error.message.includes('Email not confirmed')) {
          alert("PLEASE CHECK YOUR EMAIL: Your account is registered but needs verification. Check your inbox for the confirmation link.");
        } else {
          alert("LOGIN ERROR: " + error.message);
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        console.log("Retail OS Login Success");
        // Redirecting instantly to dashboard
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error("Login System Error:", err);
      alert("CRITICAL ERROR: Please contact system admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-blue-600 p-4">
      <div className="bg-white p-8 rounded-[35px] shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-black text-slate-800 mb-2 text-center uppercase italic">
          NM MART OS
        </h2>
        <p className="text-center text-slate-500 mb-8 font-bold">PLEASE SIGN IN</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 rounded-2xl bg-slate-100 border-none font-bold outline-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 rounded-2xl bg-slate-100 border-none font-bold outline-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all disabled:bg-slate-400"
          >
            {loading ? 'SIGNING IN...' : 'LOGIN TO SYSTEM'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;