'use client';

export const DetailHeaderSkeleton = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="min-w-0 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
          <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </header>
  );
};
