import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 text-white">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-slate-800 md:hidden block"
        >
          <Menu className="w-6 h-6 text-slate-400" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search items..." 
            className="pl-10 pr-4 py-2 bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-500 w-64 text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200">Admin User</p>
            <p className="text-xs text-slate-500">NM MART Wholesale</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-900/20">
            A
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
