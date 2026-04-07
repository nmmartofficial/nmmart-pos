import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Scan, AlertCircle } from 'lucide-react';

const Items = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    category: '',
    purchase_price: '',
    sale_price: '',
    stock_quantity: '',
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching products:', error.message);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      ...formData,
      user_id: user.id,
      purchase_price: parseFloat(formData.purchase_price),
      sale_price: parseFloat(formData.sale_price),
      stock_quantity: parseInt(formData.stock_quantity),
    };

    if (editingProduct) {
      // Update product
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        console.error('Error updating product:', error.message);
      } else {
        setEditingProduct(null);
        setShowForm(false);
        fetchProducts();
      }
    } else {
      // Add new product
      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) {
        console.error('Error adding product:', error.message);
      } else {
        setShowForm(false);
        fetchProducts();
      }
    }
    setLoading(false);
    setFormData({
      name: '',
      barcode: '',
      category: '',
      purchase_price: '',
      sale_price: '',
      stock_quantity: '',
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      purchase_price: product.purchase_price,
      sale_price: product.sale_price,
      stock_quantity: product.stock_quantity,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error.message);
      } else {
        fetchProducts();
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-golden-yellow border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-800 font-black tracking-widest uppercase">Loading Items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              barcode: '',
              category: '',
              purchase_price: '',
              sale_price: '',
              stock_quantity: '',
            });
            setShowForm(true);
          }}
          className="bg-golden-yellow text-gray-900 px-4 py-2 rounded-lg shadow-md flex items-center hover:bg-yellow-500 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow"
              required
            />
            <div className="relative">
              <input
                type="text"
                name="barcode"
                placeholder="Barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow pr-10"
              />
              <Scan className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow"
            />
            <input
              type="number"
              name="purchase_price"
              placeholder="Purchase Price"
              value={formData.purchase_price}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow"
              required
            />
            <input
              type="number"
              name="sale_price"
              placeholder="Sale Price"
              value={formData.sale_price}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow"
              required
            />
            <input
              type="number"
              name="stock_quantity"
              placeholder="Stock Quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow"
              required
            />
            <div className="col-span-1 md:col-span-2 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-golden-yellow text-gray-900 px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Product List</h3>
        {products.length === 0 ? (
          <p className="text-gray-600">No products found. Add a new product to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P. Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{product.barcode}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">₹{product.purchase_price.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">₹{product.sale_price.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 flex items-center">
                      {product.stock_quantity}
                      {product.stock_quantity < 10 && (
                        <AlertCircle className="w-4 h-4 text-red-500 ml-2" title="Low Stock" />
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-golden-yellow hover:text-yellow-500 mr-3"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;