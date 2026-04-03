import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, ArrowUpDown, IndianRupee, Box } from 'lucide-react';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { id: 1, name: 'Red Label Tea', hsn: '0902', stock: 120, unit: 'Pcs', wholesalePrice: 145, retailPrice: 160, category: 'Groceries' },
    { id: 2, name: 'Tata Salt', hsn: '2501', stock: 50, unit: 'Box', wholesalePrice: 420, retailPrice: 450, category: 'Groceries' },
    { id: 3, name: 'Fortune Oil 1L', hsn: '1512', stock: 15, unit: 'Bag', wholesalePrice: 1850, retailPrice: 1950, category: 'Oil & Ghee' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-4">
              <Box className="w-8 h-8 text-red-500" />
              Inventory
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage stock, wholesale prices, and product units.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={Filter}>Filter</Button>
            <Button icon={Plus}>Add New Item</Button>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="flex-1 relative group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by Product Name, HSN or Category..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-slate-200 placeholder:text-slate-700 outline-none focus:ring-1 focus:ring-red-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 flex-1 md:flex-none">
                <ArrowUpDown className="w-4 h-4" />
                Sort: Newest
              </div>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <th className="pb-4">Product Name / Category</th>
                  <th className="pb-4">HSN Code</th>
                  <th className="pb-4">Stock Status</th>
                  <th className="pb-4">Wholesale (₹)</th>
                  <th className="pb-4">Retail (₹)</th>
                  <th className="pb-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-800/20 transition-all">
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg ring-1 ring-white/5">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">{product.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className="text-xs font-mono font-bold text-slate-400 px-3 py-1 bg-slate-950/50 rounded-lg border border-slate-800">{product.hsn}</span>
                    </td>
                    <td className="py-6">
                      <div>
                        <p className={`text-sm font-black ${product.stock < 20 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {product.stock} {product.unit}
                        </p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Remaining</p>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-slate-500" />
                        <span className="text-sm font-black text-white">{product.wholesalePrice}</span>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-slate-500" />
                        <span className="text-sm font-black text-slate-400">{product.retailPrice}</span>
                      </div>
                    </td>
                    <td className="py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-slate-600 hover:text-red-500 transition-colors bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/30">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-red-500 transition-colors bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-slate-200 transition-colors bg-slate-950/50 rounded-xl border border-slate-800">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;
