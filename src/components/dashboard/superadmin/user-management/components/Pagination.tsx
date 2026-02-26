import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import type { PaginationProps } from '../types';

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  disabled = false
}: PaginationProps) => {
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-700/60 dark:bg-slate-800/40">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Info halaman */}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Menampilkan{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {startItem} - {endItem}
          </span>{' '}
          dari{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {totalItems}
          </span>{' '}
          pengguna
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* First page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || disabled}
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 sm:inline-flex"
            title="Halaman pertama"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          {/* Previous page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || disabled}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            title="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          <div className="hidden items-center gap-1 sm:flex">
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={disabled}
                    className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-3 text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
          </div>

          {/* Mobile page indicator */}
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 sm:hidden">
            Halaman {currentPage} dari {totalPages}
          </span>

          {/* Next page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || disabled}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            title="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || disabled}
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 sm:inline-flex"
            title="Halaman terakhir"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
