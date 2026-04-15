import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Lock, 
  Image as ImageIcon, 
  Package, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Save,
  LogOut
} from 'lucide-react';

const Admin = () => {
  // --- Auth State ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState('banners'); // 'banners' or 'products'
  const [message, setMessage] = useState({ text: '', type: '' });

  // --- Banner State ---
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState(false);

  // --- Product State ---
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingPrice, setEditingPrice] = useState({}); // { productId: newPrice }
  const pageSize = 20;

  useEffect(() => {
    const session = localStorage.getItem('nm_mart_admin_session');
    if (session === 'true') {
      setIsAdmin(true);
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'banners') fetchBanners();
      if (activeTab === 'products') fetchProducts();
    }
  }, [isAdmin, activeTab, page]);

  // --- Helpers ---
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // --- Authentication ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('admin_config')
        .select('value')
        .eq('key', 'admin_password')
        .single();

      if (error) throw error;

      if (data.value === password) {
        setIsAdmin(true);
        localStorage.setItem('nm_mart_admin_session', 'true');
        showMessage('Login Successful');
      } else {
        showMessage('Invalid Password', 'error');
      }
    } catch (err) {
      showMessage('Auth Error: ' + err.message, 'error');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('nm_mart_admin_session');
  };

  // --- Banner Management ---
  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('website_banners')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setBanners(data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `offer-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('website_banners')
        .insert([{ image_url: publicUrl, is_active: true }]);

      if (dbError) throw dbError;

      showMessage('Banner Uploaded!');
      fetchBanners();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const toggleBannerStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from('website_banners')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    if (!error) fetchBanners();
  };

  const deleteBanner = async (id, url) => {
    if (!window.confirm('Delete this banner?')) return;
    
    try {
      const fileName = url.split('/').pop();
      await supabase.storage.from('banners').remove([`offer-banners/${fileName}`]);
      await supabase.from('website_banners').delete().eq('id', id);
      showMessage('Banner Deleted');
      fetchBanners();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const copyWhatsAppLink = (url) => {
    navigator.clipboard.writeText(url);
    showMessage('Link Copied to Clipboard!');
  };

  // --- Product Management ---
  const fetchProducts = async () => {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data, count, error } = await query
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('name', { ascending: true });

    if (!error) {
      setProducts(data);
      setTotalCount(count);
    }
  };

  const handlePriceChange = (id, val) => {
    setEditingPrice(prev => ({ ...prev, [id]: val }));
  };

  const savePrice = async (id) => {
    const newPrice = editingPrice[id];
    if (newPrice === undefined) return;

    const { error } = await supabase
      .from('products')
      .update({ sale_price: parseFloat(newPrice) })
      .eq('id', id);

    if (!error) {
      showMessage('Price Updated');
      setEditingPrice(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      fetchProducts();
    } else {
      showMessage(error.message, 'error');
    }
  };

  const toggleStockStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from('products')
      .update({ stock_status: !currentStatus })
      .eq('id', id);
    if (!error) {
      showMessage('Stock Status Updated');
      fetchProducts();
    } else {
      showMessage(error.message, 'error');
    }
  };

  // --- Renderers ---
  if (authLoading) return <div className="p-10 text-center">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-t-8 border-red-600">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-800 mb-2">NM MART ADMIN</h1>
          <p className="text-center text-slate-500 mb-8 font-bold uppercase tracking-widest text-sm">Secure Access Only</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Enter Admin Password" 
                className="w-full p-4 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-yellow-500 outline-none font-bold transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-red-600 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              UNLOCK DASHBOARD
            </button>
          </form>
          {message.text && (
            <p className={`mt-4 text-center font-bold ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-2 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">ADMIN PANEL</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Tabs */}
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
          <button 
            onClick={() => setActiveTab('banners')}
            className={`flex-1 py-3 rounded-xl font-black text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'banners' ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <ImageIcon className="w-5 h-5" /> BANNERS
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 rounded-xl font-black text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'products' ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Package className="w-5 h-5" /> PRODUCTS
          </button>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl font-bold text-center animate-bounce ${message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message.text}
          </div>
        )}

        {/* Banner Section */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
              <h2 className="text-xl font-black text-slate-800 mb-4 italic">UPLOAD NEW OFFER</h2>
              <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className={`w-12 h-12 mb-3 ${uploading ? 'text-yellow-500 animate-bounce' : 'text-slate-300 group-hover:text-yellow-500'}`} />
                  <p className="mb-2 text-sm text-slate-500 font-bold tracking-wider">
                    {uploading ? 'UPLOADING...' : 'CLICK TO UPLOAD BANNER'}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">PNG, JPG or WEBP (Max 2MB)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} accept="image/*" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 group">
                  <div className="relative h-48 bg-slate-100">
                    <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                        className={`p-2 rounded-full shadow-lg transition-all ${banner.is_active ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'}`}
                      >
                        {banner.is_active ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <p className={`text-sm font-bold ${banner.is_active ? 'text-green-600' : 'text-slate-400'}`}>
                        {banner.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => copyWhatsAppLink(banner.image_url)}
                        className="bg-yellow-100 text-yellow-700 p-3 rounded-2xl hover:bg-yellow-200 transition-all"
                        title="Copy Link for WhatsApp"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteBanner(banner.id, banner.image_url)}
                        className="bg-red-100 text-red-600 p-3 rounded-2xl hover:bg-red-200 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Section */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 italic uppercase">MANAGE PRODUCTS</h2>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-500 outline-none font-bold text-sm"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    onKeyUp={(e) => e.key === 'Enter' && fetchProducts()}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest">Item Name</th>
                      <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest w-32 text-center">Price (₹)</th>
                      <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest w-24 text-center">Stock</th>
                      <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest w-16 text-right">Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((product) => (
                      <tr key={product.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="py-4">
                          <p className="font-bold text-slate-800 leading-tight">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{product.barcode || 'NO BARCODE'}</p>
                        </td>
                        <td className="py-4 text-center">
                          <input 
                            type="number" 
                            className="w-24 p-2 rounded-xl bg-slate-100 border-2 border-transparent focus:border-yellow-500 outline-none font-black text-slate-700 text-center"
                            value={editingPrice[product.id] ?? product.sale_price}
                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                          />
                        </td>
                        <td className="py-4 text-center">
                          <button 
                            onClick={() => toggleStockStatus(product.id, product.stock_status)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${product.stock_status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                          >
                            {product.stock_status ? 'IN STOCK' : 'OUT STOCK'}
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          {editingPrice[product.id] !== undefined && (
                            <button 
                              onClick={() => savePrice(product.id)}
                              className="bg-red-600 text-white p-2 rounded-xl shadow-md hover:bg-red-700 active:scale-90 transition-all inline-flex items-center justify-center"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Showing {products.length} of {totalCount} items
                </p>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-3 rounded-2xl border-2 border-slate-100 hover:border-yellow-500 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="bg-yellow-500 text-white px-5 py-3 rounded-2xl font-black">
                    {page}
                  </div>
                  <button 
                    disabled={page * pageSize >= totalCount}
                    onClick={() => setPage(p => p + 1)}
                    className="p-3 rounded-2xl border-2 border-slate-100 hover:border-yellow-500 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
