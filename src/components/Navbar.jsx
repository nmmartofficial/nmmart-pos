import React from 'react';
import { Search, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick, screenTitle }) => {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 text-gray-900">
      {/* Left: Hamburger Menu */}
      <button 
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-gray-100"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Center: Screen Title */}
      <h1 className="text-lg font-bold uppercase tracking-wide">
        {screenTitle || 'DASHBOARD'}
      </h1>

      {/* Right: Search Icon */}
      <button className="p-2 rounded-xl hover:bg-gray-100">
        <Search className="w-5 h-5 text-gray-700" />
      </button>
    </nav>
  );
};

export default Navbar;
