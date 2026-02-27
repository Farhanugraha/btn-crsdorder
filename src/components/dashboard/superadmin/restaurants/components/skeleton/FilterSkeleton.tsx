'use client';

export const FilterSkeleton = () => {
  return (
    <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
      <div className="space-y-5">
        {/* Title & Icon Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-slate-200/50 blur-sm dark:bg-slate-700/50"></div>
              <div className="relative h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div>
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar Skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Buttons Skeleton */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/50 p-1.5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          </div>

          {/* Area Selector Skeleton */}
          <div className="relative">
            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 sm:w-48"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
