import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function SalesHistory({ shop }) {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false });

    if (!error) setSales(data || []);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#2c3e50' }}>📊 Sales History & Records</h1>
      <p style={{ color: '#7f8c8d' }}>यहाँ आपके सभी पुराने बिलों का रिकॉर्ड सुरक्षित है।</p>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <table width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '15px' }}>Date</th>
              <th>Invoice No.</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td style={{ fontWeight: 'bold', color: '#3498db' }}>{s.invoice_no}</td>
                <td>{s.costumer_name || 'Cash Sale'}</td>
                <td style={{ fontWeight: 'bold' }}>₹{s.total_amount}</td>
                <td>
                  <button 
                    onClick={() => alert("Re-printing functionality can be added here!")}
                    style={{ background: '#eee', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    🖨️ Re-Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesHistory;