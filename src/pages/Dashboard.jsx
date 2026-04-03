import React from 'react';
import Layout from '../components/Layout';
import { ShoppingCart, Package, Users, BarChart, TrendingUp, TrendingDown, Receipt, IndianRupee } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Sales', value: '₹4,52,340', change: '+12.5%', isUp: true, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Invoices', value: '142', change: '+8.2%', isUp: true, icon: Receipt, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Inventory Items', value: '856', change: '-2.1%', isUp: false, icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Total Retailers', value: '24', change: '+4.5%', isUp: true, icon: Users, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Overview</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-all">
              This Month
            </button>
            <button className="px-4 py-2.5 bg-red-600 rounded-2xl text-white text-sm font-bold shadow-lg shadow-red-900/30 hover:bg-red-700 transition-all flex items-center gap-2 ring-1 ring-red-500/50">
              <ShoppingCart className="w-4 h-4" />
              New Bill
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl shadow-black/40 group hover:border-slate-700 transition-all relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ring-1 ring-white/5`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                  {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
              </div>
              {/* Background Glow */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 rounded-full transition-opacity group-hover:opacity-20 ${stat.bg}`}></div>
            </div>
          ))}
        </div>

        {/* Charts & Tables Section Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sales Table Placeholder */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold text-white flex items-center gap-3">
                <Receipt className="w-5 h-5 text-red-500" />
                Recent Sales
              </h4>
              <button className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Invoice #</th>
                    <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                    <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 text-sm font-bold text-slate-200">#INV-2024-{1000 + item}</td>
                      <td className="py-4 text-sm font-medium text-slate-400 group-hover:text-slate-200">Rahul General Store</td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider rounded-full ring-1 ring-emerald-500/20">Paid</span>
                      </td>
                      <td className="py-4 text-sm font-black text-white">₹{ (Math.random() * 5000 + 1000).toFixed(2) }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Placeholder */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-black/40 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold text-white flex items-center gap-3">
                <BarChart className="w-5 h-5 text-red-500" />
                Low Stock
              </h4>
              <button className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider">Restock</button>
            </div>
            <div className="space-y-6 flex-1">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-red-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                      {item}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">Item Name {item}</p>
                      <p className="text-xs text-slate-500">HSN: 1204</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-red-500">12 Pcs</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
