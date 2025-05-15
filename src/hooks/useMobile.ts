'use client';

import { useState, useEffect } from 'react';
import { BreakpointState } from '~/types/Mobile';

export function useMobile(): BreakpointState {
  const [breakpoint, setBreakpoint] = useState<BreakpointState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    width: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateBreakpoint();

    const handleResize = () => {
      updateBreakpoint();
    };

    function updateBreakpoint() {
      const width = window.innerWidth;
      setBreakpoint({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        isLargeDesktop: width >= 1280,
        width,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}
