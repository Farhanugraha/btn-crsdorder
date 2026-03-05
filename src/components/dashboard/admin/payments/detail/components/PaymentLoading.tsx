import React from 'react';
import { CreditCard } from 'lucide-react';
import { PAYMENT_MESSAGES } from '../constants';

export const PaymentLoading = () => {
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
            {PAYMENT_MESSAGES.LOADING}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {PAYMENT_MESSAGES.LOADING_DESC}
          </p>
        </div>
      </div>
    </div>
  );
};
