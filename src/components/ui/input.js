import React from 'react';

export const Input = React.forwardRef(({ className = '', type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={`block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-blue-500 focus:ring-blue-500 
        disabled:cursor-not-allowed disabled:bg-gray-100
        ${className}`}
      ref={ref}
      {...props}
    />
  );
}); 