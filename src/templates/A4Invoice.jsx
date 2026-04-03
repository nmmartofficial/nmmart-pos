import React from 'react';

const A4Invoice = ({ data }) => {
  const { 
    invoiceNo = 'NM-10234', 
    date = '03 Apr 2026', 
    customer = { name: 'Rahul General Store', address: 'Main Market, Raipur', gstin: '22AAAAA0000A1Z5' },
    items = [
      { name: 'Red Label Tea 250g', hsn: '0902', qty: 24, unit: 'Pcs', price: 120, gst: 18 },
      { name: 'Tata Salt 1kg', hsn: '2501', qty: 10, unit: 'Box', price: 420, gst: 5 }
    ],
    seller = { name: 'NM MART Wholesale', address: 'Station Road, Raipur', gstin: '22BBBBB1111B1Z5', phone: '9876543210' }
  } = data || {};

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const calculateTax = () => items.reduce((sum, item) => sum + (item.price * item.qty * item.gst / 100), 0);
  const total = calculateSubtotal() + calculateTax();

  return (
    <div className="bg-white p-12 text-slate-900 font-sans max-w-[210mm] mx-auto border border-slate-200 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-red-600 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black text-red-600 tracking-tighter mb-2">TAX INVOICE</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">NM MART Retail OS • Wholesale Billing</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">{seller.name}</h2>
          <p className="text-sm font-medium text-slate-600 max-w-[250px] ml-auto">{seller.address}</p>
          <p className="text-sm font-bold text-slate-900 mt-1">GSTIN: {seller.gstin}</p>
          <p className="text-sm font-bold text-slate-900">Phone: {seller.phone}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Bill To</h3>
          <div>
            <p className="text-lg font-black text-slate-900 uppercase">{customer.name}</p>
            <p className="text-sm font-medium text-slate-600 mt-1">{customer.address}</p>
            <p className="text-sm font-bold text-slate-900 mt-2">GSTIN: {customer.gstin}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Invoice Info</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500 uppercase tracking-widest">Invoice Number</span>
              <span className="font-black text-slate-900">{invoiceNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500 uppercase tracking-widest">Invoice Date</span>
              <span className="font-black text-slate-900">{date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500 uppercase tracking-widest">Place of Supply</span>
              <span className="font-black text-slate-900">Chhattisgarh (22)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12 border-collapse">
        <thead>
          <tr className="bg-slate-50 border-y border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <th className="py-4 px-4 text-left">#</th>
            <th className="py-4 px-4 text-left">Description of Goods / HSN</th>
            <th className="py-4 px-4 text-right">Qty</th>
            <th className="py-4 px-4 text-right">Unit Price</th>
            <th className="py-4 px-4 text-right">GST %</th>
            <th className="py-4 px-4 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <tr key={idx} className="text-sm">
              <td className="py-5 px-4 font-bold text-slate-400">{idx + 1}</td>
              <td className="py-5 px-4">
                <p className="font-black text-slate-900">{item.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">HSN: {item.hsn}</p>
              </td>
              <td className="py-5 px-4 text-right font-bold text-slate-900">{item.qty} {item.unit}</td>
              <td className="py-5 px-4 text-right font-bold text-slate-900">{item.price.toFixed(2)}</td>
              <td className="py-5 px-4 text-right font-bold text-slate-900">{item.gst}%</td>
              <td className="py-5 px-4 text-right font-black text-slate-900">{(item.price * item.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="flex justify-end gap-12">
        <div className="w-1/2 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-500 uppercase tracking-widest">Subtotal (Excl. Tax)</span>
            <span className="font-black text-slate-900">₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-500 uppercase tracking-widest">Total Tax (GST)</span>
            <span className="font-black text-slate-900">₹{calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
            <span className="text-lg font-black text-slate-900 uppercase tracking-[0.2em]">Total Payable</span>
            <span className="text-2xl font-black text-red-600">₹{total.toFixed(2)}</span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase text-right tracking-widest mt-2 italic">
            Amount in words: Rupees Seven Thousand Five Hundred only
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-12 border-t border-slate-200 grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bank Details</h4>
          <div className="text-xs font-bold text-slate-700 space-y-1">
            <p>A/C Name: NM MART WHOLESALE</p>
            <p>Bank: HDFC Bank</p>
            <p>IFSC: HDFC0001234</p>
            <p>A/C No: 50200012345678</p>
          </div>
        </div>
        <div className="text-center space-y-12">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">For {seller.name}</p>
          <div className="w-48 h-1 bg-slate-200 mx-auto"></div>
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Authorized Signatory</p>
        </div>
      </div>

      <div className="mt-12 text-center border-t border-dashed border-slate-200 pt-8">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">Powered by NM Mart Retail OS</p>
      </div>
    </div>
  );
};

export default A4Invoice;
