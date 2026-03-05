import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { PAYMENT_MESSAGES } from '../constants';

interface PaymentErrorProps {
  error?: string | null;
  onBack: () => void;
}

export const PaymentError: React.FC<PaymentErrorProps> = ({
  error,
  onBack
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-400" />
        <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {PAYMENT_MESSAGES.NOT_FOUND}
        </p>
        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {PAYMENT_MESSAGES.BACK_BUTTON}
        </button>
      </div>
    </div>
  );
};
