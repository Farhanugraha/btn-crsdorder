'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PaymentsPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export const PaymentsPagination = ({
  page,
  totalPages,
  totalItems,
  perPage,
  onPageChange
}: PaymentsPaginationProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (totalPages <= 1) return null;

  const maxVisible = isMobile ? 3 : 5;

  return (
    <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
          Menampilkan {(page - 1) * perPage + 1} -{' '}
          {Math.min(page * perPage, totalItems)} dari {totalItems}
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:p-2"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {(() => {
              const buttons = [];

              if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) {
                  buttons.push(
                    <button
                      key={i}
                      onClick={() => onPageChange(i)}
                      className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
                        page === i
                          ? 'bg-blue-600 text-white dark:bg-blue-700'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
              } else {
                // First page
                buttons.push(
                  <button
                    key={1}
                    onClick={() => onPageChange(1)}
                    className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
                      page === 1
                        ? 'bg-blue-600 text-white dark:bg-blue-700'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    1
                  </button>
                );

                // Ellipsis if needed
                if (page > 3) {
                  buttons.push(
                    <span
                      key="ellipsis1"
                      className="px-1 text-gray-400 dark:text-gray-600"
                    >
                      ...
                    </span>
                  );
                }

                // Current page and neighbors
                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);

                for (let i = start; i <= end; i++) {
                  if (i !== 1 && i !== totalPages) {
                    buttons.push(
                      <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
                          page === i
                            ? 'bg-blue-600 text-white dark:bg-blue-700'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                }

                // Ellipsis if needed
                if (page < totalPages - 2) {
                  buttons.push(
                    <span
                      key="ellipsis2"
                      className="px-1 text-gray-400 dark:text-gray-600"
                    >
                      ...
                    </span>
                  );
                }

                // Last page
                buttons.push(
                  <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
                      page === totalPages
                        ? 'bg-blue-600 text-white dark:bg-blue-700'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {totalPages}
                  </button>
                );
              }

              return buttons;
            })()}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:p-2"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
