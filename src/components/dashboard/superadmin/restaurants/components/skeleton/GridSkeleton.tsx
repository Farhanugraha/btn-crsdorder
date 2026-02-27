'use client';

export const GridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all dark:border-slate-700 dark:bg-slate-800"
        >
          {/* Photo Skeleton */}
          <div className="h-40 animate-pulse bg-slate-200 dark:bg-slate-700" />

          {/* Content Skeleton */}
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="mb-2 h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="mb-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>

            <div className="mb-4 border-t border-slate-100 pt-3 dark:border-slate-700/50">
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>

            <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          </div>

          {/* Actions Footer Skeleton */}
          <div className="mt-auto flex border-t border-slate-100 bg-slate-50/50 p-1 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex-1 py-2.5">
              <div className="mx-auto h-3 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="my-2 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 py-2.5">
              <div className="mx-auto h-3 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="my-2 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 py-2.5">
              <div className="mx-auto h-3 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
