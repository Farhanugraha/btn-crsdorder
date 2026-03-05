import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface PaymentHeaderProps {
  transactionId: string;
  onBack: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const PaymentHeader: React.FC<PaymentHeaderProps> = ({
  transactionId,
  onBack,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onBack}
              className="flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Kembali"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                Detail Transaksi
              </p>
              <h1 className="truncate text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                #{transactionId}
              </h1>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex shrink-0 items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
