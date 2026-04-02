import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function GstReport({ shop }) {
  const [report, setReport] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().split('-').slice(0, 2).join('-')); // Current Month

  useEffect(() => {
    fetchGstData();
  }, [month]);

  async function fetchGstData() {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('shop_id', shop.id)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (!error) setReport(data || []);
  }

  // CSV फाइल डाउनलोड करने का फंक्शन
  const downloadCSV = () => {
    let csvContent = "Date,Invoice No,Customer,Total Amount,Tax (18%)\n";
    report.forEach(r => {
      const tax = (r.total_amount * 0.18).toFixed(2); // मान लीजिए 18% GST है
      csvContent += `${new Date(r.created_at).toLocaleDateString()},${r.invoice_no},${r.costumer_name || 'Cash'},${r.total_amount},${tax}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `GST_Report_${month}_NM_Mart.csv`);
    a.click();
  };

  const totalMonthlySales = report.reduce((acc, curr) => acc + curr.total_amount, 0);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📑 GST & Sales Report</h1>
        <button onClick={downloadCSV} style={downloadBtn}>📥 Download Excel (CSV)</button>
      </div>

      <div style={filterCard}>
        <label>Select Month: </label>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle} />
      </div>

      <div style={statsRow}>
        <div style={statBox}>
          <small>Total Monthly Sale</small>
          <h2>₹{totalMonthlySales.toLocaleString()}</h2>
        </div>
        <div style={statBox}>
          <small>Estimated GST (18%)</small>
          <h2 style={{ color: '#e67e22' }}>₹{(totalMonthlySales * 0.18).toFixed(2)}</h2>
        </div>
      </div>

      <table width="100%" style={tableStyle}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '12px' }}>Date</th>
            <th>Invoice No</th>
            <th>Total Amount</th>
            <th>GST Amount</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{new Date(r.created_at).toLocaleDateString()}</td>
              <td>{r.invoice_no}</td>
              <td>₹{r.total_amount}</td>
              <td>₹{(r.total_amount * 0.18).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const filterCard = { background: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '20px' };
const inputStyle = { padding: '8px', marginLeft: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const statsRow = { display: 'flex', gap: '20px', marginBottom: '20px' };
const statBox = { flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const tableStyle = { borderCollapse: 'collapse', background: '#fff', textAlign: 'left' };
const downloadBtn = { padding: '10px 20px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default GstReport;