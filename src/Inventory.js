import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Inventory({ shop }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '', barcode: '' });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const { data } = await supabase.from('products').select('*').eq('shop_id', shop.id);
    setItems(data || []);
  }

  const handleAdd = async () => {
    if (!form.name || !form.price) return alert("नाम और रेट ज़रूरी हैं!");
    const { error } = await supabase.from('products').insert([{ ...form, shop_id: shop.id }]);
    if (!error) { 
      fetchItems(); 
      setForm({ name: '', price: '', stock: '', barcode: '' }); 
      alert("Item Added with Barcode!");
    }
  };

  return (
    <div>
      <h1>📦 Inventory & Stock</h1>
      <div style={formCard}>
        <h3>Add New Stock</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
          <input placeholder="Item Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <input placeholder="Stock Qty" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          <input placeholder="Scan/Type Barcode" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} style={{border: '2px solid #3498db'}} />
        </div>
        <button onClick={handleAdd} style={addBtn}>Save to Inventory</button>
      </div>

      <table border="1" width="100%" style={tableStyle}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white' }}>
            <th style={{padding:'12px'}}>Name</th>
            <th>Barcode</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td style={{padding:'10px'}}>{i.name}</td>
              <td style={{color: '#3498db', fontWeight: 'bold'}}>{i.barcode || '---'}</td>
              <td>₹{i.price}</td>
              <td style={{color: i.stock < 5 ? 'red' : 'black'}}>{i.stock} PCS</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const formCard = { background: '#fff', padding: '25px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const addBtn = { marginTop: '15px', padding: '12px 30px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const tableStyle = { borderCollapse: 'collapse', background: '#fff', marginTop: '20px', textAlign: 'left' };

export default Inventory;