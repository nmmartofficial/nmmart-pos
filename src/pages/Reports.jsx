import React from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { BarChart3, Download, Calendar, Search, FileText, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import * as XLSX from 'xlsx';

const Reports = () => {
  const reportData = [
    { date: '2026-04-01', invNo: 'NM-1001', customer: 'Rahul Store', subtotal: 4500, gst: 810, total: 5310, status: 'Paid' },
    { date: '2026-04-02', invNo: 'NM-1002', customer: 'Pooja Mart', subtotal: 1200, gst: 216, total: 1416, status: 'Paid' },
    { date: '2026-04-03', invNo: 'NM-1003', customer: 'Vikas General', subtotal: 3500, gst: 630, total: 4130, status: 'Unpaid' },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, `NM_MART_Sales_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-4">
              <BarChart3 className="w-8 h-8 text-red-500" />
              Reports & Analytics
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Export GST-compliant data for GSTR-1 and CA filing.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={Calendar}>Select Date</Button>
            <Button onClick={exportToExcel} icon={Download} className="shadow-red-900/40">Export to Excel</Button>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total GST Collected</p>
              <h3 className="text-3xl font-black text-white flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-red-500" />
                1,65,420
              </h3>
              <p className="text-emerald-500 text-xs font-bold mt-4 flex items-center gap-1 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                +18.2% from last month
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-600/10 blur-3xl rounded-full transition-all group-hover:scale-150"></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Sales Volume</p>
              <h3 className="text-3xl font-black text-white flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-red-500" />
                9,20,540
              </h3>
              <p className="text-emerald-500 text-xs font-bold mt-4 flex items-center gap-1 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last month
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/10 blur-3xl rounded-full transition-all group-hover:scale-150"></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Taxable Value</p>
              <h3 className="text-3xl font-black text-white flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-red-500" />
                7,55,120
              </h3>
              <p className="text-red-500 text-xs font-bold mt-4 flex items-center gap-1 bg-red-500/10 w-fit px-2 py-1 rounded-lg">
                <TrendingDown className="w-3 h-3" />
                -2.1% from last month
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-600/10 blur-3xl rounded-full transition-all group-hover:scale-150"></div>
          </div>
        </div>

        {/* Detailed Report Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <h4 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wider">
              <FileText className="w-5 h-5 text-red-500" />
              GSTR-1 Summary
            </h4>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative group flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter by Party Name..." 
                  className="w-full md:w-64 pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-slate-200 outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Invoice No.</th>
                  <th className="pb-4">Party Name</th>
                  <th className="pb-4">Subtotal (₹)</th>
                  <th className="pb-4">Tax (GST) (₹)</th>
                  <th className="pb-4">Total Amount (₹)</th>
                  <th className="pb-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {reportData.map((row, index) => (
                  <tr key={index} className="group hover:bg-slate-800/20 transition-all">
                    <td className="py-6 text-sm font-bold text-slate-400">{row.date}</td>
                    <td className="py-6 text-sm font-black text-slate-200">{row.invNo}</td>
                    <td className="py-6 text-sm font-bold text-slate-400">{row.customer}</td>
                    <td className="py-6 text-sm font-black text-slate-200">{row.subtotal.toFixed(2)}</td>
                    <td className="py-6 text-sm font-black text-slate-200">{row.gst.toFixed(2)}</td>
                    <td className="py-6 text-sm font-black text-white">₹{row.total.toFixed(2)}</td>
                    <td className="py-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1 ${
                        row.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' : 'bg-red-500/10 text-red-500 ring-red-500/20'
                      }`}>
                        {row.status}
                      </span>
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

export default Reports;
