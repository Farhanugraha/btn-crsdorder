'use client';

import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  return (
    <div className="animate-fade-in flex items-center justify-between rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 dark:border-red-800 dark:from-red-900/20 dark:to-rose-900/20">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-100 p-1 dark:bg-red-900/30">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
