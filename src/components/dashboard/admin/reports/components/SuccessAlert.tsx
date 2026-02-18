'use client';

import { CheckCircle, X } from 'lucide-react';

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

export const SuccessAlert = ({
  message,
  onClose
}: SuccessAlertProps) => {
  return (
    <div className="animate-fade-in flex items-center justify-between rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-green-100 p-1 dark:bg-green-900/30">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-sm font-medium text-green-800 dark:text-green-300">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
