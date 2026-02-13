'use client';

import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  orderId: string;
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export const ErrorState = ({
  orderId,
  error,
  onRetry,
  onBack
}: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 py-12">
        <div className="text-6xl">❌</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {error || 'Pesanan Tidak Ditemukan'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Order ID: {orderId}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Coba Lagi
          </Button>
          <Button
            onClick={onBack}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Kembali ke Pesanan
          </Button>
        </div>
      </div>
    </div>
  );
};
