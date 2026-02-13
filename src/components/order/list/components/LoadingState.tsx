'use client';

export const LoadingState = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-[6px] border-emerald-100 border-t-emerald-600"></div>
        <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-[3px] border-transparent border-t-emerald-400"></div>
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600"></div>
      </div>
      <div className="mt-6 text-center">
        <p className="animate-pulse text-lg font-semibold text-slate-700 dark:text-slate-300">
          Memuat pesanan...
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
          Sedang mengambil data pesanan Anda, harap tunggu.
        </p>
      </div>
    </div>
  );
};
