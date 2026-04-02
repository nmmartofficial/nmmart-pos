import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function Settings({ shop }) {
  const [formData, setFormData] = useState({
    shop_name: shop.shop_name,
    owner_name: shop.owner_name || 'Abdul', 
    address: shop.address || '',
    phone: shop.phone || '',
    gstin: shop.gstin || '',
    profile_pic: shop.profile_pic || 'https://via.placeholder.com/150',
    bill_message: shop.bill_message || 'Thank you for shopping!'
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('shops')
      .update(formData)
      .eq('id', shop.id);

    if (!error) {
      alert("Profile & Store Details Updated! ✅");
    } else {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '20px' }}>👤 My Profile & Store Settings</h1>
      
      <div style={layoutGrid}>
        
        {/* Left Side: Profile Preview Card */}
        <div style={profileCard}>
          <div style={imageWrapper}>
            <img src={formData.profile_pic} alt="Profile" style={profileImg} />
          </div>
          <h2 style={{ margin: '10px 0 5px 0' }}>{formData.owner_name}</h2>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>Store Owner</p>
          
          <div style={infoBox}>
            <p><b>Store:</b> {formData.shop_name}</p>
            <p><b>ID:</b> {shop.id}</p>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div style={formCard}>
          <h3 style={{ marginTop: 0, color: '#34495e' }}>Update Information</h3>
          
          <div style={inputRow}>
            <div style={inputGroup}>
              <label style={labelStyle}>Owner Name</label>
              <input value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value})} style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Phone Number</label>
              <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Shop Name</label>
            <input value={formData.shop_name} onChange={e => setFormData({...formData, shop_name: e.target.value})} style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Full Address</label>
            <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} rows="2" />
          </div>

          <div style={inputRow}>
            <div style={inputGroup}>
              <label style={labelStyle}>GSTIN (Optional)</label>
              <input value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Profile Photo URL</label>
              <input value={formData.profile_pic} onChange={e => setFormData({...formData, profile_pic: e.target.value})} style={inputStyle} placeholder="https://image-link.com" />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Bill Footer Message</label>
            <input value={formData.bill_message} onChange={e => setFormData({...formData, bill_message: e.target.value})} style={inputStyle} />
          </div>

          <button onClick={handleUpdate} disabled={loading} style={saveBtn}>
            {loading ? 'Updating...' : '💾 Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Styles (CSS) ---
const containerStyle = { maxWidth: '1000px', margin: '0 auto' };
const layoutGrid = { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' };
const profileCard = { background: '#fff', padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 'fit-content' };
const formCard = { background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const imageWrapper = { width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto', border: '4px solid #f0f2f5' };
const profileImg = { width: '100%', height: '100%', objectFit: 'cover' };
const infoBox = { textAlign: 'left', marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px', fontSize: '14px' };
const inputRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputGroup = { marginBottom: '15px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
const saveBtn = { width: '100%', padding: '12px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' };

export default Settings;