'use client';

export const StatCardSkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/80">
      <div className="h-0.5 w-full animate-pulse bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700/30">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </td>
    </tr>
  );
};

export const MobileCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div className="border-t border-slate-50 px-4 pb-4 dark:border-slate-700/40">
        <div className="flex flex-wrap gap-2 pt-3">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
};

export const FilterPanelSkeleton = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="h-6 w-6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-9 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PaginationSkeleton = () => {
  return (
    <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-700/60 dark:bg-slate-800/40">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
};
