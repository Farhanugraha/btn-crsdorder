'use client';

export const MenuFilterSkeleton = () => {
  return (
    <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/40 dark:to-blue-900/20 sm:px-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>

        {/* Filter Buttons Skeleton */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
};
