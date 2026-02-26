import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  userId: string;
}

export const ErrorState = ({ error, userId }: ErrorStateProps) => {
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
                  Detail Pengguna
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-700 dark:text-red-300">
                {error}
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                ID Pengguna: {userId}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/user-management">
              <button className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                Kembali ke Daftar Pengguna
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
