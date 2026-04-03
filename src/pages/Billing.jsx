import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Plus, Trash2, Receipt, Search, ShoppingBag, CreditCard, UserPlus, IndianRupee } from 'lucide-react';

const Billing = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Sample Wholesale Product', price: 120, qty: 1, unit: 'Box', gst: 18, hsn: '1234' },
  ]);

  const units = ['Box', 'Pcs', 'Dozen', 'Bag'];

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', price: 0, qty: 1, unit: 'Pcs', gst: 18, hsn: '' }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const calculateGST = () => items.reduce((sum, item) => sum + (item.price * item.qty * item.gst / 100), 0);
  const total = calculateSubtotal() + calculateGST();

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Left Side: Billing Form */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Billing</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Generate professional GST-compliant invoices.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" icon={Search}>Search Inventory</Button>
              <Button onClick={addItem} icon={Plus}>Add Item</Button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl shadow-black/40 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wider">
                  <Receipt className="w-5 h-5 text-red-500" />
                  Invoice Details
                </h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-2">Date: <span className="text-slate-200">03 Apr 2026</span></span>
                  <span className="flex items-center gap-2">Inv #: <span className="text-slate-200">NM-10234</span></span>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <th className="pb-4">Product Name / HSN</th>
                      <th className="pb-4">Qty</th>
                      <th className="pb-4">Unit</th>
                      <th className="pb-4">Price (₹)</th>
                      <th className="pb-4">GST (%)</th>
                      <th className="pb-4 text-right">Total (₹)</th>
                      <th className="pb-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {items.map((item) => (
                      <tr key={item.id} className="group transition-colors hover:bg-slate-800/20">
                        <td className="py-4 pr-4">
                          <input 
                            type="text" 
                            placeholder="Product Name" 
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-700"
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems.find(i => i.id === item.id).name = e.target.value;
                              setItems(newItems);
                            }}
                          />
                          <input 
                            type="text" 
                            placeholder="HSN" 
                            className="w-24 bg-transparent border-none text-[10px] text-slate-500 font-bold uppercase tracking-widest px-0 mt-1 focus:ring-0"
                            value={item.hsn}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems.find(i => i.id === item.id).hsn = e.target.value;
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="py-4 pr-4 w-20">
                          <input 
                            type="number" 
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            value={item.qty}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems.find(i => i.id === item.id).qty = parseInt(e.target.value) || 0;
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="py-4 pr-4 w-28">
                          <select 
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer"
                            value={item.unit}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems.find(i => i.id === item.id).unit = e.target.value;
                              setItems(newItems);
                            }}
                          >
                            {units.map(u => <option key={u} value={u} className="bg-slate-900">{u}</option>)}
                          </select>
                        </td>
                        <td className="py-4 pr-4 w-28">
                          <input 
                            type="number" 
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            value={item.price}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems.find(i => i.id === item.id).price = parseFloat(e.target.value) || 0;
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="py-4 pr-4 w-20">
                          <select 
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer"
                            value={item.gst}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems.find(i => i.id === item.id).gst = parseInt(e.target.value);
                              setItems(newItems);
                            }}
                          >
                            {[0, 5, 12, 18, 28].map(g => <option key={g} value={g} className="bg-slate-900">{g}%</option>)}
                          </select>
                        </td>
                        <td className="py-4 text-right text-sm font-black text-white w-28">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </td>
                        <td className="py-4 text-center w-16">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Summary & Customer */}
        <div className="w-full lg:w-[400px] space-y-8">
          {/* Customer Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-red-500" />
                Retailer
              </h4>
              <button className="text-red-500 hover:text-red-400 transition-colors">
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search Retailer..." 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder:text-slate-700 outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl border-dashed">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest text-center">No Retailer Selected</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-black/40">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3 mb-8">
              <CreditCard className="w-5 h-5 text-red-500" />
              Summary
            </h4>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Subtotal</span>
                <span className="text-slate-200 font-black">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-widest">GST Amount</span>
                <span className="text-slate-200 font-black">₹{calculateGST().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-base font-bold text-white uppercase tracking-[0.2em]">Grand Total</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-red-500 block">₹{total.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Includes all taxes</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="py-4 text-xs">Save Draft</Button>
              <Button className="py-4 text-xs shadow-red-900/50" icon={IndianRupee}>Pay & Print</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Billing;
