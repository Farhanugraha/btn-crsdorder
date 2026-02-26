'use client';

import Link from 'next/link';
import { ArrowLeft, MoreVertical } from 'lucide-react';

interface HeaderProps {
  userId: number;
  userName: string;
  showMobileMenu: boolean;
  onMobileMenuToggle: () => void;
}

export const Header = ({
  userId,
  userName,
  showMobileMenu,
  onMobileMenuToggle
}: HeaderProps) => {
  return (
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
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ID: {userId} • {userName}
              </p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="relative md:hidden">
            <button
              type="button"
              onClick={onMobileMenuToggle}
              className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <MoreVertical className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Mobile menu will be rendered here by parent component */}
          </div>
        </div>
      </div>
    </header>
  );
};
