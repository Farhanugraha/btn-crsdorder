'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
  onClose: () => void;
}

export const ErrorAlert = ({ error, onClose }: ErrorAlertProps) => {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 lg:p-4">
      <AlertCircle className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
      <p className="flex-1 font-medium">{error}</p>
      <button
        onClick={onClose}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        <span className="text-xl">×</span>
      </button>
    </div>
  );
};
