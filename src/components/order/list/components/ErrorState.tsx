'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onOrder: () => void;
}

export const ErrorState = ({
  error,
  onRetry,
  onOrder
}: ErrorStateProps) => {
  return (
    <div className="mt-6">
      <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50/50 to-white/50 p-6 backdrop-blur-sm dark:border-red-800 dark:from-red-900/20 dark:to-slate-900/30">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h4 className="mb-1 font-semibold text-red-800 dark:text-red-300">
              Gagal Memuat Pesanan
            </h4>
            <p className="mb-4 text-sm text-red-700/80 dark:text-red-400/80">
              {error}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={onRetry}
                variant="destructive"
                size="sm"
              >
                Coba Lagi
              </Button>
              <Button
                onClick={onOrder}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Pesan Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
