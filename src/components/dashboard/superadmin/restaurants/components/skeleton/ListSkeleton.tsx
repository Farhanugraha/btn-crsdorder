'use client';

export const ListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
        >
          {/* Photo Skeleton */}
          <div className="h-24 w-24 flex-shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />

          {/* Info Skeleton */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-4 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-3 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-700 sm:border-0 sm:pt-0">
            <div className="h-9 w-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-700/50">
              <div className="h-8 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-8 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
