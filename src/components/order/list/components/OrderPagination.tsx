'use client';

import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const OrderPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: OrderPaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Menampilkan {startItem}-{endItem} dari {totalItems} pesanan
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            Awal
          </Button>
          <div className="flex items-center">
            {Array.from(
              { length: Math.min(3, totalPages) },
              (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage === 1) {
                  pageNum = i + 1;
                } else if (currentPage === totalPages) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={
                      currentPage === pageNum ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="h-8 w-8 text-sm"
                  >
                    {pageNum}
                  </Button>
                );
              }
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Akhir
          </Button>
        </div>
      </div>
    </div>
  );
};
