'use client';

export const LoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-slate-700"></div>
        <p className="mt-4 font-medium text-slate-600 dark:text-slate-400">
          Menyiapkan halaman...
        </p>
      </div>
    </div>
  );
};
