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

  // --- UI Styles (Slim Sidebar) ---
  const sidebarWidth = window.innerWidth < 768 ? '60px' : '200px';

  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    fontFamily: 'Arial, sans-serif'
  };

  const sidebarStyle = {
    width: sidebarWidth,
    background: '#1a1a2e',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    height: '100vh'
  };

  const navItem = (tab) => ({
    padding: '15px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start',
    backgroundColor: activeTab === tab ? '#d32f2f' : 'transparent',
    borderLeft: activeTab === tab ? '4px solid #fff' : '4px solid transparent',
    transition: '0.2s',
    fontSize: '14px',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  });

  const iconStyle = { marginRight: window.innerWidth < 768 ? '0' : '10px', fontSize: '18px' };

  return (
    <div style={containerStyle}>
      
      {/* --- SLIM SIDEBAR --- */}
      <div style={sidebarStyle}>
        <div style={{ padding: '20px 10px', textAlign: 'center', borderBottom: '1px solid #2c2c44' }}>
          <h2 style={{ fontSize: '18px', margin: 0, display: window.innerWidth < 768 ? 'none' : 'block' }}>NM MART</h2>
          <span style={{ fontSize: '20px', display: window.innerWidth < 768 ? 'block' : 'none' }}>🏪</span>
        </div>
        
        <nav style={{ flex: 1, marginTop: '10px' }}>
          <div onClick={() => setActiveTab('home')} style={navItem('home')}>
            <span style={iconStyle}>🏠</span> {window.innerWidth < 768 ? '' : 'Dashboard'}
          </div>
          <div onClick={() => setActiveTab('billing')} style={navItem('billing')}>
            <span style={iconStyle}>🛒</span> {window.innerWidth < 768 ? '' : 'Billing'}
          </div>
          <div onClick={() => setActiveTab('inventory')} style={navItem('inventory')}>
            <span style={iconStyle}>📦</span> {window.innerWidth < 768 ? '' : 'Inventory'}
          </div>
          <div onClick={() => setActiveTab('sales')} style={navItem('sales')}>
            <span style={iconStyle}>📊</span> {window.innerWidth < 768 ? '' : 'History'}
          </div>
          <div onClick={() => setActiveTab('gst')} style={navItem('gst')}>
            <span style={iconStyle}>📑</span> {window.innerWidth < 768 ? '' : 'GST'}
          </div>
          <div onClick={() => setActiveTab('settings')} style={navItem('settings')}>
            <span style={iconStyle}>⚙️</span> {window.innerWidth < 768 ? '' : 'Settings'}
          </div>
        </nav>

        <div onClick={onLogout} style={{ ...navItem('logout'), color: '#ff7675', borderTop: '1px solid #2c2c44' }}>
          <span style={iconStyle}>🚪</span> {window.innerWidth < 768 ? '' : 'Logout'}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {activeTab === 'home' && (
          <div>
            <h1 style={{fontSize: '22px'}}>Welcome, {shop.shop_name}</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
              <div style={cardBox('#2ecc71')}>Today: ₹{stats.totalSales}</div>
              <div style={cardBox('#3498db')}>Bills: {stats.billCount}</div>
              <div style={cardBox('#e74c3c')}>Low Stock: {stats.lowStock}</div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && <Billing shop={shop} />}
        {activeTab === 'inventory' && <Inventory shop={shop} />}
        {activeTab === 'sales' && <SalesHistory shop={shop} />}
        {activeTab === 'gst' && <GstReport shop={shop} />}
        {activeTab === 'settings' && <Settings shop={shop} />}
      </div>
    </div>
  );
}

const cardBox = (col) => ({
  background: '#fff', padding: '20px', borderRadius: '10px', 
  borderLeft: `5px solid ${col}`, boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  fontWeight: 'bold'
});

export default Dashboard;