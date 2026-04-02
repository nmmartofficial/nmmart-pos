import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Billing from './Billing';
import Inventory from './Inventory';
import SalesHistory from './SalesHistory';
import GstReport from './GstReport';
import Settings from './Settings'; // सुनिश्चित करें कि Settings.js फाइल बनी हुई है

function Dashboard({ shop, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({ totalSales: 0, billCount: 0, lowStock: 0 });

  // --- डैशबोर्ड के लाइव आंकड़े लोड करना ---
  useEffect(() => {
    if (activeTab === 'home') {
      fetchAnalytics();
    }
  }, [activeTab, shop.id]);

  async function fetchAnalytics() {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. आज की कुल सेल
    const { data: sales } = await supabase.from('sales')
      .select('total_amount')
      .eq('shop_id', shop.id)
      .gte('created_at', today);
    
    let total = sales?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0;
    
    // 2. लो स्टॉक अलर्ट (Stock < 5)
    const { data: lowItems } = await supabase.from('products')
      .select('id')
      .eq('shop_id', shop.id)
      .lt('stock', 5);

    setStats({
      totalSales: total,
      billCount: sales?.length || 0,
      lowStock: lowItems?.length || 0
    });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', background: '#f0f2f5' }}>
      
      {/* --- SIDEBAR --- */}
      <div className="no-print" style={sidebarStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{shop.shop_name}</h2>
          <div style={badgeStyle}>NM OS v7.0 Professional</div>
        </div>
        
        <nav style={{ flex: 1 }}>
          <div onClick={() => setActiveTab('home')} style={{ ...navItem, background: activeTab === 'home' ? '#3498db' : 'transparent' }}>🏠 Dashboard Home</div>
          <div onClick={() => setActiveTab('billing')} style={{ ...navItem, background: activeTab === 'billing' ? '#3498db' : 'transparent' }}>🛒 Billing Counter</div>
          <div onClick={() => setActiveTab('inventory')} style={{ ...navItem, background: activeTab === 'inventory' ? '#3498db' : 'transparent' }}>📦 Stock Inventory</div>
          <div onClick={() => setActiveTab('sales')} style={{ ...navItem, background: activeTab === 'sales' ? '#3498db' : 'transparent' }}>📊 Sales History</div>
          <div onClick={() => setActiveTab('gst')} style={{ ...navItem, background: activeTab === 'gst' ? '#2ecc71' : 'transparent' }}>📑 GST Report</div>
          
          <div style={{ marginTop: '25px', paddingLeft: '15px', fontSize: '11px', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '1px' }}>Settings & Admin</div>
          <div onClick={() => setActiveTab('settings')} style={{ ...navItem, background: activeTab === 'settings' ? '#9b59b6' : 'transparent' }}>⚙️ Store Settings</div>
          <div onClick={() => setActiveTab('about')} style={{ ...navItem, background: activeTab === 'about' ? '#34495e' : 'transparent' }}>ℹ️ About System</div>
          <div onClick={() => setActiveTab('help')} style={{ ...navItem, background: activeTab === 'help' ? '#e67e22' : 'transparent' }}>❓ Help & Support</div>
        </nav>

        {/* Branding Box */}
        <div style={brandingBox}>
          <small style={{ color: '#bdc3c7', fontSize: '10px' }}>Powered by</small>
          <div style={{ color: '#3498db', fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px' }}>NM MART</div>
        </div>

        <div onClick={onLogout} style={logoutBtn}>🚪 Logout Session</div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{ flex: 1, padding: '35px', overflowY: 'auto' }}>
        
        {/* 1. HOME TAB */}
        {activeTab === 'home' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ color: '#1a1a2e', margin: 0 }}>Business Overview</h1>
              <button onClick={fetchAnalytics} style={{ background: '#fff', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>🔄 Refresh Stats</button>
            </div>
            
            <div style={statsGrid}>
              <div style={{ ...statCard, borderTop: '5px solid #2ecc71' }}>
                <small style={labelStyle}>TODAY'S TOTAL REVENUE</small>
                <h2 style={{ color: '#2ecc71', fontSize: '32px', margin: '10px 0' }}>₹{stats.totalSales.toLocaleString()}</h2>
                <div style={subLabel}>Gross sales for today</div>
              </div>
              <div style={{ ...statCard, borderTop: '5px solid #3498db' }}>
                <small style={labelStyle}>INVOICES GENERATED</small>
                <h2 style={{ color: '#3498db', fontSize: '32px', margin: '10px 0' }}>{stats.billCount}</h2>
                <div style={subLabel}>Total customers served</div>
              </div>
              <div style={{ ...statCard, borderTop: '5px solid #e74c3c' }}>
                <small style={labelStyle}>LOW STOCK ALERTS</small>
                <h2 style={{ color: '#e74c3c', fontSize: '32px', margin: '10px 0' }}>{stats.lowStock}</h2>
                <div style={subLabel}>Items below 5 quantity</div>
              </div>
            </div>

            <div style={quickActionCard}>
              <h3 style={{ marginTop: 0 }}>Quick Access Shortcuts</h3>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setActiveTab('billing')} style={primaryBtn}>+ New Sale (Billing)</button>
                <button onClick={() => setActiveTab('inventory')} style={secondaryBtn}>Update Inventory</button>
                <button onClick={() => setActiveTab('gst')} style={{ ...secondaryBtn, background: '#2ecc71', color: '#fff' }}>Export GST Data</button>
              </div>
            </div>
          </div>
        )}

        {/* 2. FUNCTIONAL TABS */}
        {activeTab === 'billing' && <Billing shop={shop} />}
        {activeTab === 'inventory' && <Inventory shop={shop} />}
        {activeTab === 'sales' && <SalesHistory shop={shop} />}
        {activeTab === 'gst' && <GstReport shop={shop} />}
        {activeTab === 'settings' && <Settings shop={shop} />}

        {/* 3. ABOUT SECTION */}
        {activeTab === 'about' && (
          <div style={infoCard}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🏪</div>
            <h1 style={{ color: '#3498db', margin: '0 0 10px 0' }}>NM MART RETAIL OS</h1>
            <p style={{ color: '#7f8c8d', fontSize: '18px' }}>The Ultimate Retail Management Solution</p>
            <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
            <p>यह सॉफ्टवेयर आपके व्यापार को आधुनिक, डिजिटल और आसान बनाने के लिए विकसित किया गया है।</p>
            <p><b>Developed & Managed by:</b> NM Mart Tech Team, Manjhanpur</p>
            <p><b>Contact:</b> +91 70811 54604</p>
            <div style={{ marginTop: '30px', color: '#bdc3c7' }}>Version 7.0.4 (Latest Stable)</div>
          </div>
        )}

        {/* 4. HELP SECTION */}
        {activeTab === 'help' && (
          <div style={infoCard}>
            <h2>Technical Support Center</h2>
            <p>क्या आपको कोई समस्या आ रही है? हमारी सपोर्ट टीम आपकी सहायता के लिए तैयार है।</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
              <button onClick={() => window.open('https://wa.me/917081154604')} style={whatsappBtn}>Chat on WhatsApp</button>
              <button onClick={() => window.location.href = 'mailto:support@nmmart.com'} style={{ ...whatsappBtn, background: '#34495e' }}>Email Support</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Styles ---
const sidebarStyle = { width: '280px', background: '#1a1a2e', color: '#fff', padding: '30px 20px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 15px rgba(0,0,0,0.2)' };
const navItem = { padding: '12px 18px', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px', transition: '0.3s', fontSize: '15px', fontWeight: '500' };
const logoutBtn = { padding: '15px', color: '#ff7675', cursor: 'pointer', fontWeight: 'bold', borderTop: '1px solid #34495e', textAlign: 'center', marginTop: '10px' };
const badgeStyle = { background: '#3498db', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginTop: '5px' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginTop: '30px' };
const statCard = { background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 6px 15px rgba(0,0,0,0.04)' };
const labelStyle = { color: '#7f8c8d', letterSpacing: '1px', fontWeight: 'bold' };
const subLabel = { fontSize: '12px', color: '#bdc3c7' };
const quickActionCard = { background: '#fff', padding: '30px', borderRadius: '15px', marginTop: '30px', boxShadow: '0 6px 15px rgba(0,0,0,0.04)' };
const infoCard = { background: '#fff', padding: '60px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' };
const primaryBtn = { padding: '14px 28px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' };
const secondaryBtn = { padding: '14px 28px', background: '#f1f2f6', color: '#2f3542', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' };
const whatsappBtn = { padding: '15px 35px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
const brandingBox = { marginTop: 'auto', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)' };

export default Dashboard;