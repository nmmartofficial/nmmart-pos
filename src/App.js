import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Items from './pages/Items';
import Invoices from './pages/Invoices';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import NewBilling from './pages/NewBilling';
import ExpenseManager from './pages/ExpenseManager';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import BottomNavBar from './components/BottomNavBar';


// This part checks if user is logged in or not
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const getScreenTitle = () => {
    switch (location.pathname) {
      case '/': return 'DASHBOARD';
      case '/inventory': return 'INVENTORY';
      case '/items': return 'ITEMS';
      case '/invoices': return 'INVOICES';
      case '/profile': return 'PROFILE';
      case '/reports': return 'REPORTS';
      case '/new-billing': return 'NEW BILLING';
      case '/expense-manager': return 'EXPENSE MANAGER';
      default: return 'RETAIL OS';
    }
  };
  
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white text-gray-900 font-black text-2xl animate-pulse">
      NM MART OS IS LOADING...
    </div>
  );
  
  return user ? (
    <div className="flex flex-col min-h-screen">
      <Navbar screenTitle={getScreenTitle()} />
      <main className="flex-grow pb-20"> {/* Add padding-bottom for bottom nav */}
        {children}
      </main>
      <BottomNavBar />
    </div>
  ) : (
    <Navigate replace to="/login" />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Only for logged in users */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
          <Route path="/items" element={<PrivateRoute><Items /></PrivateRoute>} />
          <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/new-billing" element={<PrivateRoute><NewBilling /></PrivateRoute>} />
          <Route path="/expense-manager" element={<PrivateRoute><ExpenseManager /></PrivateRoute>} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<Admin />} />

          {/* Redirect to dashboard if route not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;