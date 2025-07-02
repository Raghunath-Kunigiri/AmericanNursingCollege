import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ children, defaultValue, value, onValueChange, className = "", ...props }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  // Use controlled value if provided, otherwise use internal state
  const activeTab = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      // Uncontrolled mode
      setInternalValue(newValue);
    }
    // Call the callback if provided
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Remove onValueChange from props passed to DOM
  const { onValueChange: _, ...domProps } = props;

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleValueChange }}>
      <div className={`${className}`} {...domProps}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "", ...props }) {
  return (
    <div
      className={`admin-tabs-list ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className = "", ...props }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`admin-tab-trigger ${isActive ? 'active' : ''} ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className = "", ...props }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 