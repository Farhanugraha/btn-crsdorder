'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-gray-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <h2 className="text-lg font-bold text-red-900 dark:text-red-300">
                Gagal Memuat Data
              </h2>
              <p className="mt-1 text-sm text-red-800 dark:text-red-400">
                {error || 'Tidak dapat memuat data statistik'}
              </p>
              <Button
                onClick={onRetry}
                className="mt-4 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
