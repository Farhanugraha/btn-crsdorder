'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const scrollToTop = (behavior: 'smooth' | 'instant' = 'smooth') => {
    if (typeof window !== 'undefined') {
      if (behavior === 'smooth') {
        try {
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } catch {
          window.scrollTo(0, 0);
        }
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  return { scrollToTop };
};