import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({ onValueChange, children, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelect = (value, label) => {
    setSelectedValue(label);
    setIsOpen(false);
    if (onValueChange) onValueChange(value);
  };

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          isOpen, 
          setIsOpen, 
          selectedValue, 
          handleSelect 
        })
      )}
    </div>
  );
}

export function SelectTrigger({ className = '', children, isOpen, setIsOpen, selectedValue }) {
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between ${className}`}
    >
      <span className={selectedValue ? 'text-gray-900' : 'text-gray-500'}>
        {selectedValue || children}
      </span>
      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ className = '', children, isOpen, handleSelect }) {
  if (!isOpen) return null;

  return (
    <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto ${className}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { handleSelect })
      )}
    </div>
  );
}

export function SelectItem({ value, children, handleSelect }) {
  return (
    <button
      type="button"
      onClick={() => handleSelect(value, children)}
      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  );
} 