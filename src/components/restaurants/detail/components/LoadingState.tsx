'use client';

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div className="aspect-square w-full animate-pulse bg-slate-200 dark:bg-slate-700" />
    <div className="space-y-3 p-3">
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-9 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  </div>
);

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mb-4 h-10 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-3">
            <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
};
