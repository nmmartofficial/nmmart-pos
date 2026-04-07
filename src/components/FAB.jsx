import React from 'react';
import { Plus } from 'lucide-react';

const FAB = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 z-50 w-16 h-16 bg-golden-yellow rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      <Plus className="w-8 h-8 text-gray-900" />
    </button>
  );
};

export default FAB;