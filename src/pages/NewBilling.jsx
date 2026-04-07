import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Search, Scan, X, Printer, CheckCircle } from 'lucide-react';

const NewBilling = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchCustomers();
    }
  }, [user]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);
    if (error) console.error('Error fetching products:', error.message);
    else setProducts(data);
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id);
    if (error) console.error('Error fetching customers:', error.message);
    else setCustomers(data);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .or(`barcode.eq.${searchTerm},name.ilike.%${searchTerm}%`)
      .single();

    if (error) {
      console.error('Error searching product:', error.message);
      setSelectedProduct(null);
      alert('Product not found!');
    } else {
      setSelectedProduct(data);
      setQuantity(1);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) return;

    const existingItemIndex = cart.findIndex(item => item.id === selectedProduct.id);

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...selectedProduct, quantity }]);
    }
    setSelectedProduct(null);
    setSearchTerm('');
    setQuantity(1);
  };

  const calculateGST = (price, category) => {
    let gstRate = 0;
    if (category === 'Electronics') gstRate = 0.18; // 18%
    else if (category === 'Clothing') gstRate = 0.12; // 12%
    else gstRate = 0.05; // Default 5%

    const gstAmount = price * gstRate;
    return { gstRate, gstAmount };
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalGST = 0;

    cart.forEach(item => {
      const itemTotal = item.sale_price * item.quantity;
      const { gstAmount } = calculateGST(itemTotal, item.category);
      subtotal += itemTotal;
      totalGST += gstAmount;
    });

    const totalAmount = subtotal + totalGST;
    return { subtotal, totalGST, totalAmount };
  };

  const { subtotal, totalGST, totalAmount } = calculateTotals();

  const handleGenerateInvoice = async () => {
    setLoading(true);
    let currentCustomerId = null;

    // 1. Handle Customer (find or create)
    if (customerName && customerPhone) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .eq('phone_number', customerPhone)
        .single();

      if (existingCustomer) {
        currentCustomerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({ user_id: user.id, name: customerName, phone_number: customerPhone })
          .select('id')
          .single();
        if (customerError) console.error('Error creating customer:', customerError.message);
        else currentCustomerId = newCustomer.id;
      }
    }

    // 2. Create Sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        user_id: user.id,
        customer_id: currentCustomerId,
        total_amount: totalAmount,
        gst_amount: totalGST,
        payment_mode: paymentMode,
      })
      .select('id, created_at')
      .single();

    if (saleError) {
      console.error('Error creating sale:', saleError.message);
      setLoading(false);
      return;
    }

    // 3. Create Sale Items and update product stock
    const saleItemsData = cart.map(item => {
      const itemTotal = item.sale_price * item.quantity;
      const { gstRate, gstAmount } = calculateGST(itemTotal, item.category);
      return {
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.sale_price,
        gst_rate: gstRate * 100, // Store as percentage
        gst_amount: gstAmount,
        total_price: itemTotal + gstAmount,
      };
    });

    const { error: saleItemsError } = await supabase
      .from('sales_items')
      .insert(saleItemsData);

    if (saleItemsError) {
      console.error('Error creating sale items:', saleItemsError.message);
      setLoading(false);
      return;
    }

    // Update product stock
    for (const item of cart) {
      await supabase
        .from('products')
        .update({ stock_quantity: item.stock_quantity - item.quantity })
        .eq('id', item.id);
    }

    setInvoiceDetails({
      saleId: sale.id,
      createdAt: sale.created_at,
      customerName,
      customerPhone,
      cart,
      subtotal,
      totalGST,
      totalAmount,
      paymentMode,
    });
    setShowInvoiceModal(true);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setLoading(false);
  };

  const printInvoice = () => {
    // This would typically open a new window or use a PDF library
    alert('Printing invoice (placeholder)');
    setShowInvoiceModal(false);
  };

  const sendWhatsAppReceipt = () => {
    // Placeholder for WhatsApp integration
    alert('Sending WhatsApp receipt (placeholder)');
    setShowInvoiceModal(false);
  };

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New POS Billing</h2>

      {/* Product Search */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Add Product to Cart</h3>
        <div className="flex gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by Barcode or Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <Scan className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
          <button
            onClick={handleSearch}
            className="bg-golden-yellow text-gray-900 px-4 py-2 rounded-lg shadow-md flex items-center hover:bg-yellow-500 transition-colors"
            disabled={loading}
          >
            <Search className="w-5 h-5 mr-2" /> Search
          </button>
        </div>

        {selectedProduct && (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
            <div>
              <p className="font-bold text-gray-900">{selectedProduct.name} ({selectedProduct.category})</p>
              <p className="text-sm text-gray-600">Price: ₹{selectedProduct.sale_price.toFixed(2)} | Stock: {selectedProduct.stock_quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={selectedProduct.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 p-2 border border-gray-300 rounded-md text-center"
              />
              <button
                onClick={handleAddToCart}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cart */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">Cart is empty.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cart.map((item, index) => {
                  const itemTotal = item.sale_price * item.quantity;
                  const { gstRate, gstAmount } = calculateGST(itemTotal, item.category);
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">₹{item.sale_price.toFixed(2)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{(gstRate * 100).toFixed(0)}% (₹{gstAmount.toFixed(2)})</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-bold">₹{(itemTotal + gstAmount).toFixed(2)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setCart(cart.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-end items-center text-lg font-bold text-gray-900">
              <p className="mr-4">Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p className="mr-4">GST: ₹{totalGST.toFixed(2)}</p>
              <p>Total: ₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Customer & Payment */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Customer & Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Customer Name (Optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow"
          />
          <input
            type="tel"
            placeholder="Customer Phone (Optional)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden-yellow"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="block text-gray-700 font-bold mb-2 sm:mb-0">Payment Mode:</label>
          <div className="flex gap-4">
            {['Cash', 'UPI', 'Card'].map(mode => (
              <label key={mode} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-golden-yellow"
                  name="paymentMode"
                  value={mode}
                  checked={paymentMode === mode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                <span className="ml-2 text-gray-900">{mode}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Invoice */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerateInvoice}
          className="bg-golden-yellow text-gray-900 px-6 py-3 rounded-lg shadow-md flex items-center hover:bg-yellow-500 transition-colors text-lg font-bold"
          disabled={cart.length === 0 || loading}
        >
          <Printer className="w-6 h-6 mr-2" /> Generate Invoice
        </button>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && invoiceDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Invoice Generated!</h3>
            <p className="text-gray-700 mb-2">Invoice ID: {invoiceDetails.saleId.slice(0, 8)}</p>
            <p className="text-gray-700 mb-2">Date: {new Date(invoiceDetails.createdAt).toLocaleString()}</p>
            {invoiceDetails.customerName && <p className="text-gray-700 mb-2">Customer: {invoiceDetails.customerName} ({invoiceDetails.customerPhone})</p>}
            <p className="text-gray-700 mb-4">Payment Mode: {invoiceDetails.paymentMode}</p>
            
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              {invoiceDetails.cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-800">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.sale_price * item.quantity + calculateGST(item.sale_price * item.quantity, item.category).gstAmount).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-gray-900 mb-2">
              <span>Subtotal:</span>
              <span>₹{invoiceDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 mb-2">
              <span>Total GST:</span>
              <span>₹{invoiceDetails.totalGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-xl text-gray-900 mb-6">
              <span>Grand Total:</span>
              <span>₹{invoiceDetails.totalAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={printInvoice}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Print
              </button>
              <button
                onClick={sendWhatsAppReceipt}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="bg-golden-yellow text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBilling;