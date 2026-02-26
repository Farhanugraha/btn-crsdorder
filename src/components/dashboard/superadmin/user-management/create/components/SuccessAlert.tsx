'use client';

import { CheckCircle } from 'lucide-react';

interface SuccessAlertProps {
  message: string;
}

export const SuccessAlert = ({ message }: SuccessAlertProps) => {
  return (
    <div className="animate-fade-in mb-6">
      <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <div className="flex-1">
          <p className="font-medium text-emerald-700 dark:text-emerald-300">
            {message}
          </p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
            Mengalihkan ke daftar pengguna...
          </p>
        </div>
      </div>
    </div>
  );
};
