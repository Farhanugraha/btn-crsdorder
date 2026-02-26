'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditHeaderProps {
  userId: string;
  userName: string;
}

export const EditHeader = ({ userId, userName }: EditHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/user-management/${userId}`}>
              <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Edit Pengguna
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Mengedit: {userName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
