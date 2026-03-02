'use client';

import { useState } from 'react';
import Navigation from './Navigation';

interface MobileMenuWrapperProps {
  children: React.ReactNode;
}

export default function MobileMenuWrapper({ children }: MobileMenuWrapperProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Navigation
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      {children}
    </>
  );
}
