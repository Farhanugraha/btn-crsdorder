'use client';

import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
  onClose: () => void;
}

export const ErrorAlert = ({ error, onClose }: ErrorAlertProps) => {
  return (
    <div className="animate-fade-in mb-6 rounded-lg border border-red-300 bg-gradient-to-r from-red-50 to-red-100 p-4 dark:border-red-800 dark:from-red-900/20 dark:to-red-800/20">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            {error}
          </p>
          <p className="mt-1 text-xs text-red-700 dark:text-red-400">
            Silakan coba refresh halaman atau hubungi administrator
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
