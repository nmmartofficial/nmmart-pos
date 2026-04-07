import React from 'react';
import { Lock, LogOut } from 'lucide-react';
import { supabase } from '../services/supabaseClient'; // यहाँ भी 'services'

const LockScreen = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-10 text-center font-sans">
      <div className="bg-red-500/10 p-8 rounded-full mb-8 border border-red-500/20">
        <Lock size={80} className="text-red-500 animate-pulse" />
      </div>
      <h1 className="text-5xl font-black mb-4 text-red-500 tracking-tighter uppercase">Access Denied 🔒</h1>
      <p className="text-xl text-slate-400 max-w-lg mb-10 leading-relaxed">
        नमस्ते, लाइसेंस समाप्त हो गया है। कृपया आगे इस्तेमाल करने के लिए रिन्यू करें।
      </p>
      
      <div className="flex gap-4">
        <button onClick={() => supabase.auth.signOut()} className="bg-slate-800 px-10 py-5 rounded-2xl font-bold flex items-center gap-2 border border-slate-700 hover:bg-slate-700">
          <LogOut size={20} /> LOGOUT
        </button>
      </div>
    </div>
  );
};

export default LockScreen;