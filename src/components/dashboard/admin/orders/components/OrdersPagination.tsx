'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OrdersPaginationProps {
  page: number;
  pages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export const OrdersPagination = ({
  page,
  pages,
  totalItems,
  perPage,
  onPageChange
}: OrdersPaginationProps) => {
  if (pages <= 1) return null;

  return (
    <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="text-xs text-gray-600 dark:text-gray-400">
        Menampilkan{' '}
        <span className="font-semibold">
          {(page - 1) * perPage + 1}
        </span>{' '}
        -{' '}
        <span className="font-semibold">
          {Math.min(page * perPage, totalItems)}
        </span>{' '}
        dari <span className="font-semibold">{totalItems}</span>{' '}
        pesanan
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Sebelumnya
        </button>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: Math.min(5, pages) }, (_, i) => {
            let pageNum;
            if (pages <= 5) pageNum = i + 1;
            else if (page <= 3) pageNum = i + 1;
            else if (page >= pages - 2) pageNum = pages - 4 + i;
            else pageNum = page - 2 + i;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 rounded-md text-xs font-medium transition-all ${
                  page === pageNum
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          Selanjutnya
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
