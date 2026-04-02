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
      // 1. आज की सेल (Table: sales)
      const { data: sales } = await supabase.from('sales')
        .select('total_amount')
        .eq('shop_id', shop.id)
        .gte('created_at', today);
      
      let total = sales?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0;
      
      // 2. लो स्टॉक अलर्ट (यहाँ 'summar' टेबल इस्तेमाल की है क्योंकि आपकी इन्वेंट्री वहीँ है)
      const { data: lowItems } = await supabase.from('summar') 
        .select('id')
        .lt('stock', 5); // 5 से कम स्टॉक वाले आइटम

      setStats({
        totalSales: total,
        billCount: sales?.length || 0,
        lowStock: lowItems?.length || 0
      });
    } catch (err) {
      console.error("Analytics Error:", err);
    }
  }

  // अगर shop का डेटा नहीं मिला तो एरर न आए, इसलिए ये सुरक्षा:
  if (!shop) return <div style={{padding: '20px'}}>लोड हो रहा है... कृपया इंतज़ार करें।</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial', background: '#f0f2f5' }}>
      
      {/* --- SIDEBAR --- */}
      <div style={sidebarStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>{shop.shop_name || "NM MART"}</h2>
          <div style={badgeStyle}>NM OS v7.0 Professional</div>
        </div>
        
        <nav style={{ flex: 1 }}>
          <div onClick={() => setActiveTab('home')} style={{ ...navItem, background: activeTab === 'home' ? '#3498db' : 'transparent' }}>🏠 Dashboard Home</div>
          <div onClick={() => setActiveTab('billing')} style={{ ...navItem, background: activeTab === 'billing' ? '#3498db' : 'transparent' }}>🛒 Billing Counter</div>
          <div onClick={() => setActiveTab('inventory')} style={{ ...navItem, background: activeTab === 'inventory' ? '#3498db' : 'transparent' }}>📦 Stock Inventory</div>
          <div onClick={() => setActiveTab('sales')} style={{ ...navItem, background: activeTab === 'sales' ? '#3498db' : 'transparent' }}>📊 Sales History</div>
          <div onClick={() => setActiveTab('gst')} style={{ ...navItem, background: activeTab === 'gst' ? '#2ecc71' : 'transparent' }}>📑 GST Report</div>
          <div onClick={() => setActiveTab('settings')} style={{ ...navItem, background: activeTab === 'settings' ? '#9b59b6' : 'transparent' }}>⚙️ Store Settings</div>
        </nav>

        <div onClick={onLogout} style={logoutBtn}>🚪 Logout Session</div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '35px', overflowY: 'auto' }}>
        {activeTab === 'home' && (
          <div>
            <h1>Business Overview</h1>
            <div style={statsGrid}>
              <div style={{ ...statCard, borderTop: '5px solid #2ecc71' }}>
                <small>TODAY'S REVENUE</small>
                <h2 style={{ color: '#2ecc71' }}>₹{stats.totalSales.toLocaleString()}</h2>
              </div>
              <div style={{ ...statCard, borderTop: '5px solid #3498db' }}>
                <small>BILLS GENERATED</small>
                <h2 style={{ color: '#3498db' }}>{stats.billCount}</h2>
              </div>
              <div style={{ ...statCard, borderTop: '5px solid #e74c3c' }}>
                <small>LOW STOCK</small>
                <h2 style={{ color: '#e74c3c' }}>{stats.lowStock}</h2>
              </div>
            </div>
            {/* Quick Actions */}
            <div style={{marginTop: '30px', display: 'flex', gap: '10px'}}>
               <button onClick={() => setActiveTab('billing')} style={primaryBtn}>+ New Sale</button>
               <button onClick={() => setActiveTab('inventory')} style={secondaryBtn}>Check Stock</button>
            </div>
          </div>
        )}

        {/* बाकी टैब्स */}
        {activeTab === 'billing' && <Billing shop={shop} />}
        {activeTab === 'inventory' && <Inventory shop={shop} />}
        {activeTab === 'sales' && <SalesHistory shop={shop} />}
        {activeTab === 'gst' && <GstReport shop={shop} />}
        {activeTab === 'settings' && <Settings shop={shop} />}
      </div>
    </div>
  );
}

// Styles (वही पुराने वाले इस्तेमाल करें)
const sidebarStyle = { width: '280px', background: '#1a1a2e', color: '#fff', padding: '30px 20px', display: 'flex', flexDirection: 'column' };
const navItem = { padding: '12px 18px', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px' };
const badgeStyle = { background: '#3498db', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', display: 'inline-block' };
const logoutBtn = { padding: '15px', color: '#ff7675', cursor: 'pointer', textAlign: 'center', marginTop: 'auto' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' };
const statCard = { background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const primaryBtn = { padding: '12px 24px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const secondaryBtn = { padding: '12px 24px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default Dashboard;