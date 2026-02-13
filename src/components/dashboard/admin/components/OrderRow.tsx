'use client';

import { Eye } from 'lucide-react';
import { Order } from '../types';
import { getStatusLabel } from '../utils/dashboardUtils';
import { formatPrice, formatDate } from '../utils/formatters';
import { STATUS_COLORS } from '../constants/dashboardConstants';

interface OrderRowProps {
  order: Order;
}

export const OrderRow = ({ order }: OrderRowProps) => {
  const statusColor =
    STATUS_COLORS[order.order_status as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS.processing;

  return (
    <div className="p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-gray-800/50">
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-blue-600 dark:bg-gray-800 dark:text-blue-400">
                {order.order_code}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
              >
                {getStatusLabel(order.order_status)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.user.name}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {order.user.phone}
            </p>
          </div>
          <button
            onClick={() =>
              (window.location.href = `/dashboard/orders/${order.id}`)
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 sm:w-auto"
          >
            <Eye className="h-4 w-4" />
            Detail
          </button>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Rp {formatPrice(order.total_price)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(order.created_at)}
            </p>
          </div>
          {order.notes && (
            <div className="text-right">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Ada catatan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
