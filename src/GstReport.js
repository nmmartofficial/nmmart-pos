import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

const GstReport = () => {
  const [reportData, setReportData] = useState([]);

  // fetchAnalytics को useCallback में डाल दिया ताकि कोई एरर न आए
  const fetchAnalytics = useCallback(async () => {
    const { data, error } = await supabase
      .from('sales')
      .select('*');
    
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setReportData(data);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAnalytics]); // यहाँ dependency डाल दी ताकि Vercel खुश रहे

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2 style={{ color: '#d32f2f' }}>NM MART - GST Sales Report</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Date</th>
            <th>Invoice No</th>
            <th>Taxable Amt</th>
            <th>GST (5%)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.created_at}</td>
              <td>{item.invoice_number}</td>
              <td>{item.taxable_amount}</td>
              <td>{item.gst_amount}</td>
              <td>{item.total_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GstReport;