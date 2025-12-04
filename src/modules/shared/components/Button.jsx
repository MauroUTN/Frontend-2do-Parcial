import React from 'react';

function Button({ children, type = 'button', variant = 'default', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

 
  const baseClasses = "py-2 px-6 rounded-lg font-medium text-gray-600 transition duration-200 ease-in-out flex items-center justify-center text-sm sm:text-base";

  const variantStyle = {
    
    default: 'bg-purple-200 hover:bg-purple-300',
    secondary: 'bg-gray-200 hover:bg-gray-300',
  };

  const selectedVariant = variantStyle[variant] || variantStyle.default;

  return (
    <button
      {...restProps}
      type={type}
      className={`${baseClasses} ${selectedVariant} ${restProps.className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;