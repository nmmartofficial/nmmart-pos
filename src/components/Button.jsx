import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button', 
  disabled = false,
  icon: Icon = null 
}) => {
  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30 ring-1 ring-red-500/50',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    outline: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white',
    danger: 'bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-900/50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2.5 rounded-2xl font-semibold transition-all duration-200 
        flex items-center justify-center gap-2 text-sm disabled:opacity-50 
        disabled:cursor-not-allowed transform active:scale-[0.98] 
        ${variants[variant]} ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
