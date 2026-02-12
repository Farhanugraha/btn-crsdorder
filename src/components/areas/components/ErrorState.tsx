'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export const ErrorState = ({
  error,
  onRetry,
  onBack
}: ErrorStateProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          {error}
        </h3>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Tidak dapat memuat daftar area. Coba lagi atau hubungi
          administrator.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={onRetry}
            variant="destructive"
            className="flex-1"
          >
            Coba Lagi
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            Kembali
          </Button>
        </div>
      </div>
    </div>
  );
};
