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

  // --- MODERN RESPONSIVE STYLES (FINAL) ---
  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : 'row', // मोबाइल पर मेनू नीचे, कंटेंट ऊपर
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden'
  };

  const sidebarStyle = {
    width: isMobile ? '100%' : '240px',
    height: isMobile ? '70px' : '100vh',
    background: '#1e1e2d',
    color: '#a2a3b7',
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    boxShadow: isMobile ? '0 -2px 10px rgba(0,0,0,0.1)' : '4px 0 10px rgba(0,0,0,0.05)',
    zIndex: 1000
  };

  const navItem = (tab) => ({
    flex: isMobile ? 1 : 'none',
    padding: isMobile ? '10px 5px' : '15px 20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: activeTab === tab ? '#2b2b40' : 'transparent',
    color: activeTab === tab ? '#ffffff' : '#a2a3b7',
    borderTop: isMobile && activeTab === tab ? '3px solid #0095ff' : 'none',
    borderLeft: !isMobile && activeTab === tab ? '4px solid #0095ff' : 'none',
    transition: '0.2s',
    fontSize: isMobile ? '11px' : '14px',
    fontWeight: activeTab === tab ? 'bold' : 'normal'
  });

  const contentAreaStyle = {
    flex: 1,
    height: isMobile ? 'calc(100vh - 70px)' : '100vh', // यहाँ से कंटेंट दबना बंद होगा
    overflowY: 'auto',
    padding: isMobile ? '10px' : '30px',
    boxSizing: 'border-box',
    width: '100%'
  };

  const cardContainer = {
    backgroundColor: '#fff',
    minHeight: '100%',
    borderRadius: isMobile ? '8px' : '12px',
    padding: isMobile ? '15px' : '20px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.05)'
  };

  return (
    <div style={containerStyle}>
      {/* --- SIDEBAR / BOTTOM BAR --- */}
      <div style={sidebarStyle}>
        {!isMobile && (
          <div style={{ padding: '25px 20px', textAlign: 'center', borderBottom: '1px solid #2b2b40' }}>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '18px', letterSpacing: '1px' }}>NM MART</h2>
          </div>
        )}

        <nav style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'row' : 'column', width: '100%' }}>
          <div onClick={() => setActiveTab('home')} style={navItem('home')}>
             <span style={{fontSize: '22px'}}>🏠</span> {!isMobile && 'Dashboard'}
          </div>
          <div onClick={() => setActiveTab('billing')} style={navItem('billing')}>
             <span style={{fontSize: '22px'}}>🛒</span> {!isMobile && 'Billing'}
          </div>
          <div onClick={() => setActiveTab('inventory')} style={navItem('inventory')}>
             <span style={{fontSize: '22px'}}>📦</span> {!isMobile && 'Inventory'}
          </div>
          <div onClick={() => setActiveTab('sales')} style={navItem('sales')}>
             <span style={{fontSize: '22px'}}>📊</span> {!isMobile && 'History'}
          </div>
          <div onClick={() => setActiveTab('gst')} style={navItem('gst')}>
             <span style={{fontSize: '22px'}}>📑</span> {!isMobile && 'GST'}
          </div>
          <div onClick={() => setActiveTab('settings')} style={navItem('settings')}>
             <span style={{fontSize: '22px'}}>⚙️</span> {!isMobile && 'Settings'}
          </div>
          
          {!isMobile && (
            <div onClick={onLogout} style={{ ...navItem('logout'), color: '#f64e60', marginTop: 'auto' }}>
              <span style={{fontSize: '20px'}}>🚪</span> Logout
            </div>
          )}
        </nav>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={contentAreaStyle}>
        <div style={cardContainer}>
          {activeTab === 'home' && (
             <div style={{textAlign: 'center', paddingTop: '30px'}}>
               <div style={{fontSize: '50px'}}>🏪</div>
               <h2 style={{margin: '10px 0', color: '#1e1e2d'}}>NM MART - RETAIL OS</h2>
               <p style={{color: '#888', marginBottom: '30px'}}>Welcome back, {shop.shop_name} Management!</p>
               
               {isMobile && (
                 <button 
                   onClick={onLogout} 
                   style={{
                     padding: '10px 20px', 
                     backgroundColor: '#fff', 
                     color: '#f64e60', 
                     border: '1px solid #f64e60', 
                     borderRadius: '8px',
                     fontWeight: 'bold'
                   }}
                 >
                   Logout From Session
                 </button>
               )}
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