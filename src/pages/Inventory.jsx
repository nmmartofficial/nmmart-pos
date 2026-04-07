import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Plus, X, Pill, ShoppingBasket, Shirt, Save } from 'lucide-react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [businessType, setBusinessType] = useState('grocery'); 
  const [itemName, setItemName] = useState(""); 
  const [multiNames, setMultiNames] = useState([]);
  const [formData, setFormData] = useState({ price: '', stock: '', expiry: '', size: '', unit: 'pcs' });

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setProducts(data);
    setLoading(false);
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const addNameToList = () => {
    if (itemName.trim()) {
      setMultiNames([...multiNames, itemName.trim()]);
      setItemName("");
    }
  };

  const handleSave = async () => {
    if (multiNames.length === 0) return alert("कृपया कम से कम एक नाम डालें!");
    
    // सुरक्षा चेक: लॉगिन चेक करना
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return alert("Error: आपकी पहचान नहीं मिल रही। कृपया एक बार लॉग-आउट करके दोबारा लॉग-इन करें।");
    }

    const insertData = multiNames.map(name => ({
      name,
      business_type: businessType,
      price: parseFloat(formData.price) || 0,
      stock_quantity: parseInt(formData.stock) || 0,
      unit: formData.unit,
      metadata: {
        expiry: businessType === 'medicine' ? formData.expiry : null,
        size: businessType === 'cloth' ? formData.size : null
      },
      business_id: user.id
    }));

    const { error } = await supabase.from('products').insert(insertData);
    
    if (!error) {
      setShowAddModal(false);
      setMultiNames([]);
      setFormData({ price: '', stock: '', expiry: '', size: '', unit: 'pcs' });
      fetchProducts();
      alert("Inventory Updated!");
    } else {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">NM MART - Inventory</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Manage your stock professionally</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> ADD BULK STOCK
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 font-black text-slate-300 animate-pulse">LOADING STOCK...</p>
        ) : products.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${item.business_type === 'medicine' ? 'bg-red-50 text-red-500' : item.business_type === 'cloth' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                {item.business_type === 'medicine' ? <Pill /> : item.business_type === 'cloth' ? <Shirt /> : <ShoppingBasket />}
              </div>
              <span className="font-black text-xl text-slate-800 italic">₹{item.price}</span>
            </div>
            <h3 className="font-black text-lg text-slate-700 uppercase truncate">{item.name}</h3>
            <div className="mt-3 flex gap-2">
              {item.metadata?.expiry && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">EXP: {item.metadata.expiry}</span>}
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase">{item.unit}</span>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Stock</span>
              <span className={`font-black text-lg ${item.stock_quantity < 10 ? 'text-red-500' : 'text-green-600'}`}>{item.stock_quantity}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black italic uppercase">Quick Entry</h2>
              <button onClick={() => setShowAddModal(false)}><X size={24}/></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-6">
                {['medicine', 'grocery', 'cloth'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setBusinessType(t)}
                    className={`py-3 rounded-xl font-black text-[10px] uppercase border-2 transition-all ${businessType === t ? 'bg-slate-800 text-white border-slate-800 shadow-lg' : 'border-slate-100 text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={itemName} 
                  placeholder="Item name & press Enter" 
                  className="flex-1 p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all"
                  onChange={(e)=>setItemName(e.target.value)}
                  onKeyPress={(e)=>e.key==='Enter' && addNameToList()}
                />
                <button onClick={addNameToList} className="bg-slate-800 text-white px-6 rounded-xl font-black">ADD</button>
              </div>

              <div className="flex flex-wrap gap-2">
                {multiNames.map((n, i) => (
                  <span key={i} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                    {n} <X size={12} className="cursor-pointer" onClick={() => setMultiNames(multiNames.filter((_, idx) => idx !== i))} />
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Price ₹" className="p-4 bg-slate-50 rounded-xl font-black text-blue-600" onChange={(e)=>setFormData({...formData, price: e.target.value})} />
                <input type="number" placeholder="Stock Qty" className="p-4 bg-slate-50 rounded-xl font-black" onChange={(e)=>setFormData({...formData, stock: e.target.value})} />
              </div>

              {businessType === 'medicine' && (
                <input type="date" className="w-full p-4 bg-red-50 rounded-xl font-bold text-red-600 border border-red-100" onChange={(e)=>setFormData({...formData, expiry: e.target.value})} />
              )}

              <button 
                onClick={handleSave} 
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20}/> SAVE TO DATABASE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;