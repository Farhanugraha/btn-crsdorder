'use client';

interface PaymentsResultsInfoProps {
  totalItems: number;
  hasActiveFilters: boolean;
  page: number;
  totalPages: number;
}

export const PaymentsResultsInfo = ({
  totalItems,
  hasActiveFilters,
  page,
  totalPages
}: PaymentsResultsInfoProps) => {
  return (
    <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalItems > 0 ? (
            <>
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalItems}
              </span>{' '}
              pembayaran ditemukan
              {hasActiveFilters && (
                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                  (difilter)
                </span>
              )}
            </>
          ) : (
            <>
              Tidak ada pembayaran ditemukan
              {hasActiveFilters && (
                <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                  (coba ubah filter)
                </span>
              )}
            </>
          )}
        </div>
        {totalItems > 0 && (
          <div className="text-xs text-gray-500">
            Halaman {page} dari {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};
