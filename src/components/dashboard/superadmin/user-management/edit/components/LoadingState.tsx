'use client';

import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/user-management">
                <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                  <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Edit Pengguna
                </h1>
                <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Memuat data pengguna...
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column skeleton */}
          <div className="space-y-6 lg:col-span-2">
            <div className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"></div>
            <div className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"></div>
          </div>
          {/* Right column skeleton */}
          <div className="space-y-6">
            <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"></div>
            <div className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"></div>
          </div>
        </div>
      </main>
    </div>
  );
};
