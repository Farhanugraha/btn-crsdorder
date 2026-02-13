'use client';

import {
  Package,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { OrderRow } from './OrderRow';
import { EmptyState } from './EmptyState';
import { Order } from '../types';
import { getStatusLabel } from '../utils/dashboardUtils';

interface OrdersPanelProps {
  orders: Order[];
  paginatedOrders: Order[];
  isLoading: boolean;
  filterStatus: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const OrdersPanel = ({
  orders,
  paginatedOrders,
  isLoading,
  filterStatus,
  currentPage,
  totalPages,
  onPageChange
}: OrdersPanelProps) => {
  return (
    <div className="lg:col-span-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Pesanan Aktif
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {orders.length} pesanan ditemukan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {getStatusLabel(filterStatus)}
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-gray-800">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-6 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 sm:w-28"></div>
                  </div>
                  <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center">
                    <div className="space-y-2">
                      <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            ))
          ) : paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-800/50 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() =>
                    onPageChange(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2)
                        pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => onPageChange(pageNum)}
                          className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <button
                  onClick={() =>
                    onPageChange(
                      Math.min(totalPages, currentPage + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
