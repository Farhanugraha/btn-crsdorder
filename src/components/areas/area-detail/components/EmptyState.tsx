'use client';

interface EmptyStateProps {
  searchQuery: string;
  filterStatus: string;
}

export const EmptyState = ({
  searchQuery,
  filterStatus
}: EmptyStateProps) => {
  const getMessage = () => {
    if (searchQuery && filterStatus !== 'all') {
      return `Tidak ada restoran ${
        filterStatus === 'open' ? 'buka' : 'tutup'
      } dengan kata kunci "${searchQuery}"`;
    }
    if (searchQuery) {
      return `Tidak ada restoran dengan kata kunci "${searchQuery}"`;
    }
    if (filterStatus !== 'all') {
      return `Tidak ada restoran ${
        filterStatus === 'open' ? 'buka' : 'tutup'
      }`;
    }
    return 'Tidak ada restoran ditemukan';
  };

  return (
    <div className="py-16 text-center sm:py-20">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-slate-100 p-5 dark:bg-slate-800/50 sm:p-6">
          <span className="text-4xl sm:text-5xl">🍽️</span>
        </div>
      </div>
      <p className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
        {getMessage()}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Coba gunakan filter atau kata kunci lain.
      </p>
    </div>
  );
};
