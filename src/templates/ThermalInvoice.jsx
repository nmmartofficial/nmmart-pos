import React from 'react';

const ThermalInvoice = ({ data }) => {
  const { 
    invoiceNo = 'NM-10234', 
    date = '03 Apr 2026', 
    customer = { name: 'Rahul General Store' },
    items = [
      { name: 'Red Label Tea 250g', qty: 24, price: 120 },
      { name: 'Tata Salt 1kg', qty: 10, price: 420 }
    ],
    seller = { name: 'NM MART Wholesale', phone: '9876543210' }
  } = data || {};

  const calculateTotal = () => items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="bg-white p-8 text-slate-900 font-mono w-[80mm] mx-auto border border-slate-200 shadow-xl text-xs">
      <div className="text-center mb-6 space-y-1">
        <h2 className="text-xl font-black text-red-600 uppercase tracking-tighter">{seller.name}</h2>
        <p className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">NM MART Retail OS</p>
        <p className="font-bold text-slate-500">Phone: {seller.phone}</p>
      </div>

      <div className="border-t-2 border-dashed border-slate-300 py-4 space-y-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
        <div className="flex justify-between">
          <span>Inv No:</span>
          <span>{invoiceNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between">
          <span>To:</span>
          <span className="text-slate-900">{customer.name}</span>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-slate-300 py-4 space-y-4">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-widest font-black">
              <th className="text-left pb-2">Item</th>
              <th className="text-right pb-2">Qty</th>
              <th className="text-right pb-2">Price</th>
              <th className="text-right pb-2">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={idx} className="font-bold text-slate-900">
                <td className="py-2 pr-2">{item.name}</td>
                <td className="py-2 text-right">{item.qty}</td>
                <td className="py-2 text-right">{item.price}</td>
                <td className="py-2 text-right">{(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t-2 border-dashed border-slate-300 py-4 space-y-2">
        <div className="flex justify-between text-base font-black text-slate-900 uppercase tracking-[0.2em]">
          <span>Total</span>
          <span className="text-red-600">₹{calculateTotal().toFixed(2)}</span>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase text-center tracking-widest mt-4">
          Thank you for shopping!
        </p>
        <p className="text-[8px] font-black text-slate-400 uppercase text-center tracking-[0.4em] mt-4">
          Powered by NM Mart
        </p>
      </div>
    </div>
  );
};

export default ThermalInvoice;
