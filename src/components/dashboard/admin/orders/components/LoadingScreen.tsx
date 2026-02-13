'use client';

import { useEffect, useState } from 'react';
import { PackageOpen } from 'lucide-react';

export const LoadingScreen = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <PackageOpen className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Memuat Pesanan
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Sedang mengambil data pesanan...
          </p>

          {showTimeout && (
            <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                ⏳ Memuat lebih lama dari biasanya. Silakan refresh
                halaman atau hubungi administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
