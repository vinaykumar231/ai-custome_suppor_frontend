import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface SidebarContextType {
  isSidebarOpen: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isSidebarOpen] = useState<boolean>(true); // Sidebar state (you can customize this)

  return (
    <SidebarContext.Provider value={{ isSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the sidebar context
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
