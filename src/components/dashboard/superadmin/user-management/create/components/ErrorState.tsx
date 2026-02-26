'use client';

import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30">
            <AlertTriangle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">
          Autentikasi Diperlukan
        </h2>
        <p className="mb-4 text-center text-slate-600 dark:text-slate-300">
          {error || 'Silakan login untuk melanjutkan'}
        </p>
      </div>
    </div>
  );
};
