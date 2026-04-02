import React, { useState } from 'react';
import Billing from './Billing';
import Inventory from './Inventory';
import SalesHistory from './SalesHistory';
import GstReport from './GstReport';
import Settings from './Settings';

function Dashboard({ shop, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const isMobile = window.innerWidth < 768;

  // --- MOBILE OPTIMIZED STYLES ---
  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : 'row', // मोबाइल पर मेनू नीचे आएगा
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f4f7f6',
    overflow: 'hidden'
  };

  const mainAreaStyle = {
    flex: 1,
    height: isMobile ? 'calc(100vh - 65px)' : '100vh', // नेविगेशन के लिए जगह छोड़ना
    overflowY: 'auto',
    padding: isMobile ? '10px' : '30px',
    boxSizing: 'border-box'
  };

  const navBarStyle = {
    width: isMobile ? '100%' : '240px',
    height: isMobile ? '65px' : '100vh',
    background: '#1a1a2e',
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000
  };

  const navItem = (tab) => ({
    flex: isMobile ? 1 : 'none',
    padding: isMobile ? '10px 5px' : '15px 20px',
    cursor: 'pointer',
    textAlign: 'center',
    color: activeTab === tab ? '#fff' : '#a2a3b7',
    backgroundColor: activeTab === tab ? '#3498db' : 'transparent',
    fontSize: isMobile ? '10px' : '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  });

  return (
    <div style={containerStyle}>
      {/* --- NAVIGATION BAR --- */}
      <div style={navBarStyle}>
        {!isMobile && <h2 style={{color:'#fff', textAlign:'center', padding:'20px'}}>NM MART</h2>}
        <nav style={{display:'flex', flexDirection: isMobile ? 'row' : 'column', width:'100%'}}>
          <div onClick={() => setActiveTab('home')} style={navItem('home')}><span>🏠</span>{!isMobile && 'Home'}</div>
          <div onClick={() => setActiveTab('billing')} style={navItem('billing')}><span>🛒</span>{!isMobile && 'Billing'}</div>
          <div onClick={() => setActiveTab('inventory')} style={navItem('inventory')}><span>📦</span>{!isMobile && 'Stock'}</div>
          <div onClick={() => setActiveTab('sales')} style={navItem('sales')}><span>📊</span>{!isMobile && 'Sales'}</div>
          <div onClick={() => setActiveTab('gst')} style={navItem('gst')}><span>📑</span>{!isMobile && 'GST'}</div>
          <div onClick={() => setActiveTab('settings')} style={navItem('settings')}><span>⚙️</span>{!isMobile && 'Settings'}</div>
        </nav>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={mainAreaStyle}>
        <div style={{backgroundColor:'#fff', borderRadius:'10px', minHeight:'100%', padding:'15px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
          {activeTab === 'home' && <h2>Welcome, NM Mart!</h2>}
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