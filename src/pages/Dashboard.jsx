import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Receipt } from 'lucide-react';

const Dashboard = () => {
  const { profile, user, loading } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    totalSalesToday: 0,
    totalExpensesToday: 0,
    netProfit: 0,
    totalOrdersToday: 0,
    inventoryItems: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Calculate days left for license
  const getDaysLeft = () => {
    if (!profile?.license_valid_until) return 0;
    const expiry = new Date(profile.license_valid_valid_until);
    const today = new Date();
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setDataLoading(true);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch Sales Data
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('total_amount, gst_amount, sales_items(product_id, quantity, unit_price)')
      .eq('user_id', user.id)
      .gte('created_at', today);

    if (salesError) console.error('Error fetching sales:', salesError.message);

    let totalSalesToday = 0;
    let totalPurchaseCostOfItemsSold = 0;
    let totalOrdersToday = salesData ? salesData.length : 0;

    if (salesData) {
      for (const sale of salesData) {
        totalSalesToday += sale.total_amount;
        for (const item of sale.sales_items) {
          // Fetch product to get purchase price
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('purchase_price')
            .eq('id', item.product_id)
            .single();
          if (productError) console.error('Error fetching product for cost:', productError.message);
          else totalPurchaseCostOfItemsSold += product.purchase_price * item.quantity;
        }
      }
    }

    // Fetch Expenses Data
    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .gte('created_at', today);

    if (expensesError) console.error('Error fetching expenses:', expensesError.message);

    const totalExpensesToday = expensesData ? expensesData.reduce((sum, expense) => sum + expense.amount, 0) : 0;

    // Fetch Inventory Count
    const { count: inventoryCount, error: inventoryError } = await supabase
      .from('products')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    if (inventoryError) console.error('Error fetching inventory count:', inventoryError.message);

    const netProfit = totalSalesToday - totalPurchaseCostOfItemsSold - totalExpensesToday;

    setDashboardStats({
      totalSalesToday,
      totalExpensesToday,
      netProfit,
      totalOrdersToday,
      inventoryItems: inventoryCount || 0,
    });

    // Fetch Recent Transactions (Sales)
    const { data: transactions, error: transactionsError } = await supabase
      .from('sales')
      .select('id, total_amount, created_at, customers(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (transactionsError) console.error('Error fetching recent transactions:', transactionsError.message);
    else setRecentTransactions(transactions || []);

    setDataLoading(false);
  };

  if (loading || dataLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-golden-yellow border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-800 font-black tracking-widest uppercase">NM MART OS LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-gray-200">
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2 italic">
            नमस्ते, {profile?.business_name || 'NM MART'} <span className="text-golden-yellow">👋</span>
          </h1>
          <p className="text-gray-600 font-bold uppercase text-sm tracking-widest">Retail OS Dashboard | {profile?.id?.slice(0, 8)}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className={`px-6 py-3 rounded-2xl border ${daysLeft > 30 ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">License Countdown</p>
            <p className="text-xl font-black">
              {daysLeft > 0 ? `${daysLeft} DAYS REMAINING` : 'LICENSE EXPIRED'}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-bold uppercase italic">Expiry: {profile?.license_valid_until}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {[
          { label: "Today's Revenue", value: `₹${dashboardStats.totalSalesToday.toFixed(2)}`, icon: TrendingUp },
          { label: "Today's Expenses", value: `₹${dashboardStats.totalExpensesToday.toFixed(2)}`, icon: TrendingDown },
          { label: "Net Profit", value: `₹${dashboardStats.netProfit.toFixed(2)}`, icon: DollarSign },
          { label: "Total Orders", value: dashboardStats.totalOrdersToday, icon: Package },
          { label: "Inventory Items", value: dashboardStats.inventoryItems, icon: Users },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[1.5rem] border border-gray-200 group">
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-3 flex items-center">
              <stat.icon className="w-5 h-5 mr-2 text-gray-400" /> {stat.label}
            </p>
            <h2 className="text-4xl font-black text-gray-900 italic">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <p className="text-gray-600">No recent transactions.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id.slice(0, 8)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{transaction.customers?.name || 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">₹{transaction.total_amount.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{new Date(transaction.created_at).toLocaleString()}</td>
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

export default Dashboard;