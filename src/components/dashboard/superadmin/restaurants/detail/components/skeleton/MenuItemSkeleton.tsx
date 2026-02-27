'use client';

export const MenuItemSkeleton = () => {
  return (
    <div className="group flex flex-col gap-4 border-b border-slate-200 p-4 last:border-0 dark:border-slate-700 sm:flex-row sm:items-center sm:gap-4 sm:p-6">
      {/* Image Skeleton */}
      <div className="h-24 w-24 flex-shrink-0 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>

      {/* Content Skeleton */}
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-6 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex flex-shrink-0 gap-1.5 sm:gap-2">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );
};
