import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import ProfessionalInvoice from './ProfessionalInvoice';

function Billing({ shop }) {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState('CASH');
  const [invoiceNo, setInvoiceNo] = useState(Math.floor(10000 + Math.random() * 90000));
  const [search, setSearch] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => { fetchProducts(); }, [shop.id]);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').eq('shop_id', shop.id);
    setProducts(data || []);
  }

  const addToCart = (p) => {
    setCart((prev) => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) {
        return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...p, qty: 1, hsn: p.hsn || '1905', cgst: p.price * 0.025, sgst: p.price * 0.025 }];
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const match = products.find(p => p.barcode === val);
    if (match) {
      addToCart(match);
      setSearch(''); // बारकोड स्कैन होते ही बॉक्स खाली
    }
  };

  const handlePrint = () => {
    setShowInvoice(true);
    setTimeout(() => { window.print(); }, 500);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <div className="no-print" style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{color: '#1a1a2e', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>🛒 NM MART - POS Counter</h2>
        
        <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
          <input placeholder="Customer Name" style={inputStyle} onChange={e => setCustomerName(e.target.value)} />
          <input 
            ref={searchInputRef} 
            autoFocus 
            value={search} 
            placeholder="Scan Barcode or Search Name..." 
            style={{ ...inputStyle, border: '2px solid #2ecc71', flex: 2 }} 
            onChange={handleSearchChange} 
          />
        </div>

        {search.length > 1 && (
          <div style={dropdownStyle}>
            {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
              <div key={p.id} onClick={() => { addToCart(p); setSearch(''); }} style={itemStyle}>{p.name} - ₹{p.price}</div>
            ))}
          </div>
        )}

        <table width="100%" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1a2e', color: '#fff' }}>
            <tr><th style={thStyle}>Item</th><th style={thStyle}>Price</th><th style={thStyle}>Qty</th><th style={thStyle}>Total</th><th style={thStyle}>-</th></tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>₹{item.price}</td>
                <td style={tdStyle}><b>{item.qty}</b></td>
                <td style={tdStyle}>₹{item.qty * item.price}</td>
                <td style={tdStyle}><button onClick={() => setCart(cart.filter(c => c.id !== item.id))} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>✖</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {cart.length > 0 && (
          <div style={{textAlign: 'right', marginTop: '20px'}}>
            <h3>Grand Total: ₹{cart.reduce((a, b) => a + (b.price * b.qty), 0)}</h3>
            <button onClick={handlePrint} style={btnStyle}>📄 Generate Professional Bill</button>
          </div>
        )}
      </div>

      {showInvoice && <div className="print-only"><ProfessionalInvoice shop={shop} cart={cart} customerName={customerName} invoiceNo={invoiceNo} /></div>}

      <style>{`
        @media screen { .print-only { display: none; } }
        @media print { .no-print { display: none !important; } .print-only { display: block !important; } body { margin: 0; } }
      `}</style>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' };
const btnStyle = { padding: '15px 40px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' };
const thStyle = { padding: '12px', textAlign: 'left' };
const tdStyle = { padding: '12px' };
const dropdownStyle = { position: 'absolute', background: '#fff', width: '500px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 10 };
const itemStyle = { padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' };

export default Billing;