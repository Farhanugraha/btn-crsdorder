'use client';

export const RestaurantInfoSkeleton = () => {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white px-4 py-6 dark:border-slate-700 dark:from-blue-950/30 dark:to-slate-900 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Status Card Skeleton */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="h-3 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mt-3 h-8 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>

        {/* Location Card Skeleton */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="h-3 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mt-3 flex items-start gap-2.5">
            <div className="h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>

        {/* Total Menu Card Skeleton */}
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900/30 dark:to-blue-900/20">
          <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mt-3 flex items-baseline gap-2">
            <div className="h-8 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-3 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
