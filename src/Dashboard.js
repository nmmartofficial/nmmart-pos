import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Billing from './Billing';
import Inventory from './Inventory';
import SalesHistory from './SalesHistory';
import GstReport from './GstReport';
import Settings from './Settings';

function Dashboard({ shop, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const isMobile = window.innerWidth < 768;

  // --- MODERN UI STYLES ---
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // हल्का साफ़ बैकग्राउंड
    fontFamily: "'Inter', sans-serif",
  };

  const sidebarStyle = {
    width: isMobile ? '70px' : '240px',
    background: '#1e1e2d', // डार्क प्रीमियम नेवी ब्लू
    color: '#a2a3b7',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    height: '100vh'
  };

  const navItem = (tab, color) => ({
    padding: '16px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'center' : 'flex-start',
    backgroundColor: activeTab === tab ? '#2b2b40' : 'transparent',
    color: activeTab === tab ? '#ffffff' : '#a2a3b7',
    borderLeft: activeTab === tab ? `4px solid ${color || '#0095ff'}` : '4px solid transparent',
    transition: '0.2s',
    fontSize: '14px',
    fontWeight: activeTab === tab ? '600' : '400',
    marginBottom: '4px'
  });

  const mainContentStyle = {
    flex: 1,
    padding: isMobile ? '15px' : '30px',
    overflowY: 'auto'
  };

  return (
    <div style={containerStyle}>
      {/* --- SIDEBAR --- */}
      <div style={sidebarStyle}>
        <div style={{ padding: '25px 20px', textAlign: 'center', borderBottom: '1px solid #2b2b40' }}>
          {!isMobile ? (
            <h2 style={{ color: '#fff', margin: 0, fontSize: '18px', letterSpacing: '1px' }}>NM MART</h2>
          ) : (
            <span style={{ fontSize: '24px' }}>🏪</span>
          )}
        </div>

        <nav style={{ flex: 1, marginTop: '15px' }}>
          <div onClick={() => setActiveTab('home')} style={navItem('home', '#0095ff')}>
             <span style={{marginRight: isMobile ? 0 : '12px'}}>🏠</span> {!isMobile && 'Dashboard Home'}
          </div>
          <div onClick={() => setActiveTab('billing')} style={navItem('billing', '#10b981')}>
             <span style={{marginRight: isMobile ? 0 : '12px'}}>🛒</span> {!isMobile && 'Billing Counter'}
          </div>
          <div onClick={() => setActiveTab('inventory')} style={navItem('inventory', '#f59e0b')}>
             <span style={{marginRight: isMobile ? 0 : '12px'}}>📦</span> {!isMobile && 'Stock Inventory'}
          </div>
          <div onClick={() => setActiveTab('sales')} style={navItem('sales', '#8b5cf6')}>
             <span style={{marginRight: isMobile ? 0 : '12px'}}>📊</span> {!isMobile && 'Sales History'}
          </div>
          <div onClick={() => setActiveTab('gst')} style={navItem('gst', '#ef4444')}>
             <span style={{marginRight: isMobile ? 0 : '12px'}}>📑</span> {!isMobile && 'GST Report'}
          </div>
          <div onClick={() => setActiveTab('settings')} style={navItem('settings', '#64748b')}>
             <span style={{marginRight: isMobile ? 0 : '12px'}}>⚙️</span> {!isMobile && 'Store Settings'}
          </div>
        </nav>

        <div onClick={onLogout} style={{ ...navItem('logout'), color: '#f64e60', borderTop: '1px solid #2b2b40', marginTop: 'auto' }}>
          <span style={{marginRight: isMobile ? 0 : '12px'}}>🚪</span> {!isMobile && 'Logout Session'}
        </div>
      </div>

      {/* --- MAIN AREA --- */}
      <div style={mainContentStyle}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.03)' }}>
          {activeTab === 'home' && (
             <div>
               <h3 style={{ color: '#1e1e2d', marginTop: 0 }}>Business Overview</h3>
               <p style={{ color: '#b5b5c3' }}>Welcome back, NM Mart Management!</p>
               {/* यहाँ आप अपने स्टैट्स कार्ड्स डाल सकते हैं */}
             </div>
          )}
          
          {activeTab === 'billing' && <Billing shop={shop} />}
          {activeTab === 'inventory' && <Inventory shop={shop} />}
          {activeTab === 'sales' && <SalesHistory shop={shop} />}
          {activeTab === 'gst' && <GstReport shop={shop} />}
          {activeTab === 'settings' && <Settings shop={shop} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;