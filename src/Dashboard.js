import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Billing from './Billing';
import Inventory from './Inventory';
import SalesHistory from './SalesHistory';
import GstReport from './GstReport';
import Settings from './Settings';

function Dashboard({ shop, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({ totalSales: 0, billCount: 0, lowStock: 0 });
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (activeTab === 'home' && shop?.id) {
      fetchAnalytics();
    }
  }, [activeTab, shop?.id]);

  async function fetchAnalytics() {
    const today = new Date().toISOString().split('T')[0];
    try {
      const { data: sales } = await supabase.from('sales')
        .select('total_amount')
        .eq('shop_id', shop.id)
        .gte('created_at', today);
      
      let total = sales?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0;
      
      const { data: lowItems } = await supabase.from('summar') 
        .select('id')
        .lt('stock', 5);

      setStats({
        totalSales: total,
        billCount: sales?.length || 0,
        lowStock: lowItems?.length || 0
      });
    } catch (err) {
      console.error("Stats error:", err);
    }
  }

  // --- Styles ---
  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  };

  const sidebarStyle = {
    width: isMobile ? '100%' : '250px',
    background: '#1a1a2e',
    color: '#fff',
    padding: isMobile ? '10px' : '20px',
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: isMobile ? 'space-around' : 'flex-start',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    position: isMobile ? 'sticky' : 'relative',
    top: 0,
    zIndex: 100
  };

  const navItem = (tab) => ({
    padding: isMobile ? '8px 12px' : '12px 15px',
    cursor: 'pointer',
    borderRadius: '8px',
    marginBottom: isMobile ? '0' : '8px',
    fontSize: isMobile ? '12px' : '14px',
    backgroundColor: activeTab === tab ? '#3498db' : 'transparent',
    transition: '0.3s',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  });

  return (
    <div style={containerStyle}>
      
      {/* --- SIDEBAR / TOP NAVIGATION --- */}
      <div style={sidebarStyle}>
        {!isMobile && (
          <div style={{ textAlign: 'center', marginBottom: '30px', width: '100%' }}>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>{shop.shop_name}</h2>
            <span style={{ fontSize: '10px', background: '#3498db', padding: '2px 8px', borderRadius: '10px' }}>v7.0 PRO</span>
          </div>
        )}
        
        <nav style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '5px', overflowX: isMobile ? 'auto' : 'visible', width: '100%' }}>
          <div onClick={() => setActiveTab('home')} style={navItem('home')}>🏠 {isMobile ? '' : 'Home'}</div>
          <div onClick={() => setActiveTab('billing')} style={navItem('billing')}>🛒 {isMobile ? 'Bill' : 'Billing'}</div>
          <div onClick={() => setActiveTab('inventory')} style={navItem('inventory')}>📦 {isMobile ? 'Stock' : 'Inventory'}</div>
          <div onClick={() => setActiveTab('sales')} style={navItem('sales')}>📊 {isMobile ? 'Sales' : 'History'}</div>
          {!isMobile && <div onClick={() => setActiveTab('gst')} style={navItem('gst')}>📑 GST Report</div>}
          <div onClick={() => setActiveTab('settings')} style={{ ...navItem('settings'), backgroundColor: activeTab === 'settings' ? '#9b59b6' : 'transparent' }}>⚙️</div>
        </nav>

        {!isMobile && (
          <div onClick={onLogout} style={{ marginTop: 'auto', color: '#ff7675', cursor: 'pointer', fontWeight: 'bold', borderTop: '1px solid #34495e', paddingTop: '10px', width: '100%', textAlign: 'center' }}>
            🚪 Logout
          </div>
        )}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: isMobile ? '15px' : '30px', overflowY: 'auto' }}>
        
        {activeTab === 'home' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>NM MART Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '15px' }}>
              <div style={cardStyle('#2ecc71')}>
                <small>TODAY'S SALES</small>
                <h3>₹{stats.totalSales}</h3>
              </div>
              <div style={cardStyle('#3498db')}>
                <small>TOTAL BILLS</small>
                <h3>{stats.billCount}</h3>
              </div>
              <div style={cardStyle('#e74c3c')}>
                <small>LOW STOCK</small>
                <h3>{stats.lowStock} Items</h3>
              </div>
            </div>

            <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
              <button onClick={() => setActiveTab('billing')} style={btnStyle('#3498db')}>+ New Bill</button>
              <button onClick={() => setActiveTab('inventory')} style={btnStyle('#95a5a6')}>Check Stock</button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && <Billing shop={shop} />}
        {activeTab === 'inventory' && <Inventory shop={shop} />}
        {activeTab === 'sales' && <SalesHistory shop={shop} />}
        {activeTab === 'gst' && <GstReport shop={shop} />}
        {activeTab === 'settings' && <Settings shop={shop} />}
        
        {activeTab === 'about' && (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '15px' }}>
            <h2>NM MART RETAIL OS</h2>
            <p>Version 7.0.5 | Optimized for Mobile</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Helper Styles ---
const cardStyle = (color) => ({
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '12px',
  borderLeft: `6px solid ${color}`,
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
});

const btnStyle = (color) => ({
  padding: '12px 20px',
  backgroundColor: color,
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
});

export default Dashboard;