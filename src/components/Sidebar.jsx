import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, ShoppingBag } from 'lucide-react';
import { supabase } from '../services/supabaseClient'; // यहाँ भी 'services'

const Sidebar = () => {
  const { profile } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col p-6 shadow-sm">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-blue-600 tracking-tight">NM MART</h2>
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Retail OS v5.0</p>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-400 text-slate-900 shadow-lg font-bold cursor-pointer">
          <LayoutDashboard size={20} /> <span>Dashboard</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-50 cursor-pointer">
          <ShoppingBag size={20} /> <span>Inventory</span>
        </div>
      </nav>

      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase shadow-md">
            {profile?.business_name?.charAt(0) || 'N'}
          </div>
          <p className="text-sm font-bold text-slate-700 truncate">{profile?.business_name || 'My Store'}</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-red-500 font-bold p-3 w-full hover:bg-red-50 rounded-xl transition-all">
          <LogOut size={20} /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;