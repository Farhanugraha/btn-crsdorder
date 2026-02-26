import Link from 'next/link';
import { Users, Filter, Plus, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  onToggleFilter: () => void;
  showFilters: boolean;
  isLoading: boolean;
}

export const Header = ({
  onRefresh,
  onToggleFilter,
  showFilters,
  isLoading
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-200 dark:shadow-blue-950">
              <Users className="h-[18px] w-[18px] text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Kelola Pengguna
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manajemen akun &amp; hak akses sistem
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh data"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoading ? 'animate-spin' : ''
                }`}
              />
            </button>
            <button
              onClick={onToggleFilter}
              className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-all ${
                showFilters
                  ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <Link href="/dashboard/user-management/create">
              <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-200/60 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-[.98] dark:shadow-blue-950/50">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Tambah User</span>
                <span className="sm:hidden">Tambah</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
