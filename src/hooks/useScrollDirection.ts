'use client';

import { useState, useEffect } from 'react';
import { ScrollInfo } from '~/types/Scroll';

export function useScrollDirection(): ScrollInfo {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    isScrollingUp: true,
    isScrolledDown: false,
    lastScrollY: 0,
  });

  useEffect(() => {
    const SCROLL_THRESHOLD = 100;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      setScrollInfo({
        isScrollingUp:
          currentScrollY < scrollInfo.lastScrollY || currentScrollY <= 0,
        isScrolledDown: currentScrollY > SCROLL_THRESHOLD,
        lastScrollY: currentScrollY,
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollInfo.lastScrollY]);

  return scrollInfo;
}
