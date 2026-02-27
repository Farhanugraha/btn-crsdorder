'use client';

import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const NotFoundState = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-md text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Restoran Tidak Ditemukan
        </h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Maaf, restoran yang Anda cari tidak ada atau telah dihapus
          dari sistem.
        </p>
        <Link
          href="/dashboard/restaurants"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Restoran
        </Link>
      </div>
    </div>
  );
};
