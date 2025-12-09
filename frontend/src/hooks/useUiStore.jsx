import React, { createContext, useContext, useState } from 'react';

const UiContext = createContext(null);

export const UiProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const value = {
    isSidebarOpen,
    toggleSidebar,
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUiStore = () => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error('useUiStore must be used within a UiProvider');
  }
  return context;
};
