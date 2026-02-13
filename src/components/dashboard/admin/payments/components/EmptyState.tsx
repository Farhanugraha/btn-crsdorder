'use client';

import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const EmptyState = ({
  hasActiveFilters,
  onResetFilters
}: EmptyStateProps) => {
  return (
    <div className="p-8 text-center sm:p-12">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 sm:h-16 sm:w-16">
        <AlertCircle className="h-6 w-6 text-gray-400 dark:text-gray-500 sm:h-8 sm:w-8" />
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
        Tidak ada pembayaran ditemukan
      </p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2">
        {hasActiveFilters
          ? 'Coba ubah filter pencarian Anda'
          : 'Belum ada data pembayaran'}
      </p>
      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Reset Filter
        </button>
      )}
    </div>
  );
};
