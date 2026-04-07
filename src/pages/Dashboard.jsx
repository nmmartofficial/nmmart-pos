import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { profile, loading } = useAuth();

  // Calculate days left for license
  const getDaysLeft = () => {
    if (!profile?.license_valid_until) return 0;
    const expiry = new Date(profile.license_valid_until);
    const today = new Date();
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-emerald-400 font-black tracking-widest uppercase">NM MART OS LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0a0f1c] min-h-screen text-slate-200">
      {/* Premium Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#161f33] p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2 italic">
            नमस्ते, {profile?.business_name || 'NM MART'} <span className="text-emerald-400">👋</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">Retail OS Dashboard | {profile?.id?.slice(0, 8)}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className={`px-6 py-3 rounded-2xl border ${daysLeft > 30 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">License Countdown</p>
            <p className="text-xl font-black">
              {daysLeft > 0 ? `${daysLeft} DAYS REMAINING` : 'LICENSE EXPIRED'}
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-bold uppercase italic">Expiry: {profile?.license_valid_until}</p>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {[
          { label: "Today's Revenue", value: "₹0.00", color: "blue" },
          { label: "Total Orders", value: "0", color: "emerald" },
          { label: "Inventory Items", value: "0", color: "purple" },
          { label: "Active Staff", value: "1", color: "orange" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#161f33] p-8 rounded-[2rem] border border-slate-800 hover:border-slate-600 transition-all shadow-lg group">
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-3 group-hover:text-white transition-colors">{stat.label}</p>
            <h2 className="text-4xl font-black text-white italic">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Premium Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative group overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-600 to-teal-800 p-10 shadow-2xl hover:scale-[1.01] transition-all cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-4xl font-black text-white mb-3 italic tracking-tighter uppercase">NEW BILLING</h3>
            <p className="text-emerald-100 mb-8 font-bold text-lg opacity-80 uppercase tracking-wide">Generate High-Speed Digital Invoice</p>
            <button className="bg-white text-emerald-800 px-10 py-4 rounded-2xl font-black hover:shadow-2xl transition-all uppercase tracking-widest">
              Launch POS
            </button>
          </div>
          <div className="absolute -right-16 -bottom-16 opacity-10 group-hover:scale-125 transition-all duration-500">
            <span className="text-[200px] font-black italic">POS</span>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-[3rem] bg-[#1e293b] p-10 border border-slate-700 shadow-2xl hover:scale-[1.01] transition-all cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-4xl font-black text-white mb-3 italic tracking-tighter uppercase">INVENTORY</h3>
            <p className="text-slate-400 mb-8 font-bold text-lg uppercase tracking-wide">Smart Stock & Supply Management</p>
            <button className="bg-slate-700 text-white px-10 py-4 rounded-2xl font-black hover:bg-slate-600 transition-all uppercase tracking-widest border border-slate-600">
              Manage Stock
            </button>
          </div>
          <div className="absolute -right-16 -bottom-16 opacity-10 group-hover:scale-125 transition-all duration-500">
            <span className="text-[200px] font-black italic">STK</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;