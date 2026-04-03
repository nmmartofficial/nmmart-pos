import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShoppingCart } from 'lucide-react';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-['Inter'] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-red-900/40 mb-4 ring-1 ring-red-500/50">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">NM MART Retail OS</h1>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-medium">Wholesale Management SaaS</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl shadow-black/50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nmmart.com" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 text-base rounded-2xl mt-4" 
              icon={ArrowRight}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Branding */}
          <div className="mt-8 text-center pt-6 border-t border-slate-800">
            <p className="text-slate-500 text-xs font-medium italic tracking-wide">
              Powered by <span className="text-slate-400 font-bold not-italic">NM Mart</span>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-slate-600 text-xs">Public sign-ups are disabled. Contact Admin for access.</p>
          <div className="flex justify-center gap-4 text-[10px] text-slate-700 font-bold uppercase tracking-[0.2em]">
            <a href="#!" className="hover:text-slate-500 transition-colors">Support</a>
            <span>•</span>
            <a href="#!" className="hover:text-slate-500 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#!" className="hover:text-slate-500 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
