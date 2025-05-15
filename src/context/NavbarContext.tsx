'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { NavbarContextType } from '~/types/Navbar';

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [isNavbarVisible, setNavbarVisible] = React.useState(true);

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, setNavbarVisible }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}
