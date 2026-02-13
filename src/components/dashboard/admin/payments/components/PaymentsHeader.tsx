'use client';

import { FileText, RefreshCw, Filter } from 'lucide-react';

interface PaymentsHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onToggleMobileFilters: () => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const PaymentsHeader = ({
  onRefresh,
  isRefreshing,
  onToggleMobileFilters,
  hasActiveFilters,
  onResetFilters
}: PaymentsHeaderProps) => {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg lg:p-3">
            <FileText className="h-6 w-6 text-white lg:h-8 lg:w-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">
              Manajemen Pembayaran
            </h1>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 lg:text-sm">
              Kelola semua pembayaran pesanan pelanggan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-all hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
            >
              <span>Reset Filter</span>
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 lg:px-4 lg:py-2.5 lg:text-sm"
            title="Refresh data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={onToggleMobileFilters}
            className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
