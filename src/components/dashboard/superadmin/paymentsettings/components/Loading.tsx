'use client';

import { CreditCard } from 'lucide-react';

interface Props {
  isLoading: boolean;
  isLoadingData: boolean;
}

export default function Loading({ isLoading, isLoadingData }: Props) {
  if (!isLoading && !isLoadingData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CreditCard className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {isLoading ? 'Memuat Pengaturan' : 'Mengambil Data...'}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {isLoading
              ? 'Sedang memuat halaman...'
              : 'Mengambil data pengaturan pembayaran...'}
          </p>
        </div>
      </div>
    </div>
  );
}
