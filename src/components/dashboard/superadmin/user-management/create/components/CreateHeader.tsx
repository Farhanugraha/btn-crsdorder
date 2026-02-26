'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const CreateHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/user-management">
              <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 dark:text-white">
                Tambah Pengguna Baru
              </h1>
              <p className="mt-1 text-sm text-blue-600 dark:text-slate-400">
                Buat akun pengguna baru untuk sistem
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
