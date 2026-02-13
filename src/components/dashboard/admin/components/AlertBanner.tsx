'use client';

import { AlertCircle } from 'lucide-react';

export const AlertBanner = () => {
  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-5 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Penting!
          </p>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            Verifikasi bukti pembayaran sebelum memproses pesanan.
          </p>
        </div>
      </div>
    </div>
  );
};
