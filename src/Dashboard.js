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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', background: '#f0f2f5' }}>
      
      {/* --- SIDEBAR (नया और बेहतर) --- */}
      <div style={sidebarStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>{shop.shop_name}</h2>
          <div style={badgeStyle}>NM OS v7.0 PRO</div>
        </div>
        
        <nav style={{ flex: 1 }}>
          <div onClick={() => setActiveTab('home')} style={{ ...navItem, background: activeTab === 'home' ? '#3498db' : 'transparent' }}>🏠 Dashboard Home</div>
          <div onClick={() => setActiveTab('billing')} style={{ ...navItem, background: activeTab === 'billing' ? '#3498db' : 'transparent' }}>🛒 Billing Counter</div>
          <div onClick={() => setActiveTab('inventory')} style={{ ...navItem, background: activeTab === 'inventory' ? '#3498db' : 'transparent' }}>📦 Stock Inventory</div>
          <div onClick={() => setActiveTab('sales')} style={{ ...navItem, background: activeTab === 'sales' ? '#3498db' : 'transparent' }}>📊 Sales History</div>
          <div onClick={() => setActiveTab('gst')} style={{ ...navItem, background: activeTab === 'gst' ? '#2ecc71' : 'transparent' }}>📑 GST Report</div>
          
          <div style={{ marginTop: '20px', paddingLeft: '10px', fontSize: '11px', color: '#7f8c8d' }}>ADMIN & HELP</div>
          <div onClick={() => setActiveTab('settings')} style={{ ...navItem, background: activeTab === 'settings' ? '#9b59b6' : 'transparent' }}>⚙️ Store Settings</div>
          <div onClick={() => setActiveTab('about')} style={{ ...navItem, background: activeTab === 'about' ? '#34495e' : 'transparent' }}>ℹ️ About System</div>
          <div onClick={() => setActiveTab('help')} style={{ ...navItem, background: activeTab === 'help' ? '#e67e22' : 'transparent' }}>❓ Help & Support</div>
        </nav>

        <div onClick={onLogout} style={logoutBtn}>🚪 Logout Session</div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        
        {activeTab === 'home' && (
          <div>
            <h1>Business Overview</h1>
            <div style={statsGrid}>
              <div style={{ ...statCard, borderTop: '5px solid #2ecc71' }}>
                <small>TODAY'S REVENUE</small>
                <h2 style={{ color: '#2ecc71', fontSize: '28px' }}>₹{stats.totalSales.toLocaleString()}</h2>
              </div>
              <div style={{ ...statCard, borderTop: '5px solid #3498db' }}>
                <small>TOTAL BILLS</small>
                <h2 style={{ color: '#3498db', fontSize: '28px' }}>{stats.billCount}</h2>
              </div>
              <div style={{ ...statCard, borderTop: '5px solid #e74c3c' }}>
                <small>LOW STOCK</small>
                <h2 style={{ color: '#e74c3c', fontSize: '28px' }}>{stats.lowStock}</h2>
              </div>
            </div>
            
            <div style={{ marginTop: '30px', background: '#fff', padding: '20px', borderRadius: '10px' }}>
               <h3>Quick Actions</h3>
               <button onClick={() => setActiveTab('billing')} style={primaryBtn}>+ New Bill</button>
               <button onClick={() => setActiveTab('inventory')} style={secondaryBtn}>Check Stock</button>
            </div>
          </div>
        )}

        {/* --- Functional Components --- */}
        {activeTab === 'billing' && <Billing shop={shop} />}
        {activeTab === 'inventory' && <Inventory shop={shop} />}
        {activeTab === 'sales' && <SalesHistory shop={shop} />}
        {activeTab === 'gst' && <GstReport shop={shop} />}
        {activeTab === 'settings' && <Settings shop={shop} />}
        
        {activeTab === 'about' && (
          <div style={infoCard}>
            <h2>NM MART RETAIL OS</h2>
            <p>Version 7.0.4 (Latest Stable)</p>
            <p>Developed for NM Mart, Manjhanpur</p>
          </div>
        )}

        {activeTab === 'help' && (
          <div style={infoCard}>
            <h2>Support Center</h2>
            <p>Contact: +91 70811 54604</p>
            <button style={primaryBtn} onClick={() => window.open('https://wa.me/917081154604')}>WhatsApp Support</button>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Styles (CSS) ---
const sidebarStyle = { width: '260px', background: '#1a1a2e', color: '#fff', padding: '25px', display: 'flex', flexDirection: 'column' };
const navItem = { padding: '12px 15px', cursor: 'pointer', borderRadius: '8px', marginBottom: '5px', fontSize: '14px', transition: '0.2s' };
const badgeStyle = { background: '#3498db', fontSize: '10px', padding: '3px 10px', borderRadius: '15px', display: 'inline-block' };
const logoutBtn = { padding: '12px', color: '#ff7675', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid #34495e', marginTop: '10px' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' };
const statCard = { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const infoCard = { background: '#fff', padding: '40px', borderRadius: '15px', textAlign: 'center' };
const primaryBtn = { padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' };
const secondaryBtn = { padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Dashboard;