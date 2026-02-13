'use client';

import { Package, Clock } from 'lucide-react';

interface EmptyStateProps {
  statusFilter: string;
  onResetFilters: () => void;
}

export const EmptyState = ({
  statusFilter,
  onResetFilters
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        {statusFilter === 'processing' ? (
          <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        ) : (
          <Package className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        )}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        {statusFilter === 'processing'
          ? 'Tidak Ada Pesanan Menunggu'
          : 'Tidak Ada Pesanan Ditemukan'}
      </h3>
      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
        {statusFilter === 'processing'
          ? "Tidak ada pesanan dengan status 'Menunggu' yang sesuai dengan filter yang dipilih."
          : 'Tidak ada pesanan yang sesuai dengan filter yang Anda pilih. Coba ubah filter atau kata kunci pencarian.'}
      </p>
      <button
        onClick={onResetFilters}
        className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800"
      >
        Reset Filter
      </button>
    </div>
  );
};
