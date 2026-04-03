import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Package, BarChart3, User, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Billing', icon: Receipt, path: '/billing' },
    { name: 'Inventory', icon: Package, path: '/inventory' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
    { name: 'Account', icon: User, path: '/account' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-16 md:w-64 transition-all duration-300 border-r border-slate-800">
      <div className="flex items-center justify-center h-16 border-b border-slate-800">
        <span className="text-xl font-bold text-red-500 md:block hidden uppercase tracking-wider">NM MART</span>
        <span className="text-xl font-bold text-red-500 md:hidden block">NM</span>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-2 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`
              }
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="ml-3 font-medium hidden md:block">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-2 border-t border-slate-800">
        <button className="flex items-center w-full px-3 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200">
          <LogOut className="w-6 h-6 shrink-0" />
          <span className="ml-3 font-medium hidden md:block text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
