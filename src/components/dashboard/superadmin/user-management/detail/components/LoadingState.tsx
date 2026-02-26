import { ArrowLeft, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header dengan skeleton loading effect */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/user-management"
                aria-label="Kembali ke daftar pengguna"
              >
                <button
                  className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                  aria-label="Kembali"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Detail Pengguna
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Memuat data...
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content dengan loading spinner */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            {/* Animated container */}
            <div className="relative mx-auto h-20 w-20">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-slate-700"></div>

              {/* Inner pulsing circle */}
              <div className="absolute inset-2 flex items-center justify-center">
                <div className="h-12 w-12 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-2.5">
                  <User className="h-full w-full text-white" />
                </div>
              </div>
            </div>

            {/* Loading text with dots animation */}
            <div className="mt-6 space-y-2">
              <p className="font-medium text-slate-600 dark:text-slate-400">
                Memuat detail pengguna
                <span className="inline-flex gap-0.5">
                  <span className="animate-bounce [animation-delay:-0.3s]">
                    .
                  </span>
                  <span className="animate-bounce [animation-delay:-0.2s]">
                    .
                  </span>
                  <span className="animate-bounce [animation-delay:-0.1s]">
                    .
                  </span>
                </span>
              </p>

              {/* Skeleton loading indicators */}
              <div className="mx-auto mt-8 max-w-md space-y-4">
                <div className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
