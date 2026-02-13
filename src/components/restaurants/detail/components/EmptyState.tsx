'use client';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 dark:bg-slate-800/50">
      <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
        <span className="text-5xl">🍽️</span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Belum ada menu tersedia
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Restoran ini belum memperbarui daftar menu mereka.
      </p>
    </div>
  );
};
