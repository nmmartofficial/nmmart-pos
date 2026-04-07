import React from 'react';
import { User, Barcode, FileText, LayoutDashboard, Plus, Home } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const BottomNavBar = () => {
  const navigate = useNavigate();

  // 1. navItems को यहाँ डिफाइन किया गया है (Error 1 Fix)
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Items', icon: Barcode, path: '/items' },
    { name: 'Invoice', icon: FileText, path: '/invoices' },
    { name: 'Reports', icon: LayoutDashboard, path: '/reports' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative bg-[#f2c94c] h-20 rounded-t-[40px] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex justify-around items-center px-4">
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center transition-all duration-300 mb-2
              ${isActive ? 'text-black scale-110' : 'text-gray-800 opacity-70'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon strokeWidth={isActive ? 3 : 2.5} className="w-6 h-6" />
                <span className="text-[9px] font-black uppercase tracking-tighter mt-1">
                  {item.name}
                </span>
                <div className={`w-1.5 h-1.5 bg-black rounded-full mt-1 transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </>
            )}
          </NavLink>
        ))}

        <button 
          onClick={() => navigate('/new-billing')}
          className="absolute -top-6 right-6 bg-[#f2c94c] p-4 rounded-full shadow-lg border-4 border-white hover:rotate-90 transition-all duration-500 active:scale-95"
        >
          <Plus className="w-8 h-8 text-black" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

// 2. यह लाइन सबसे ज़रूरी है (Error 2 Fix)
export default BottomNavBar;