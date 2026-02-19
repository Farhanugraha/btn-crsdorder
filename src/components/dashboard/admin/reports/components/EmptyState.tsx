'use client';

import { BarChart3 } from 'lucide-react';

interface EmptyStateProps {
  onRefresh: () => void;
  onModuleSelect: () => void; // Required
}

export const EmptyState = ({
  onRefresh,
  onModuleSelect
}: EmptyStateProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        <BarChart3 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
        Belum ada data laporan
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Data akan muncul setelah ada aktivitas dalam sistem
      </p>
      <div className="mt-4 space-x-2">
        <button
          onClick={onRefresh}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          Coba Muat Ulang
        </button>
        <button
          onClick={onModuleSelect}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          Pilih Modul
        </button>
      </div>
    </div>
  );
};
