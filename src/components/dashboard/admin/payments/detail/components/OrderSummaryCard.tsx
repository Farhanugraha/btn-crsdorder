import React from 'react';
import { FileText, MapPin, Store } from 'lucide-react';
import { OrderData } from '../types';
import {
  formatCurrency,
  getOrderStatusLabel,
  getOrderStatusColor
} from '../utils/paymentHelpers';

interface OrderSummaryCardProps {
  order: OrderData;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  order
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-gray-100">
          <FileText className="h-5 w-5" />
          Ringkasan Pesanan
        </h2>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Kode Order
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
            #{order.order_code}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Total Harga
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            Rp {formatCurrency(order.total_price)}
          </p>
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          {order.area && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Area
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {order.area.name}
                </p>
              </div>
            </div>
          )}

          {order.restaurant && (
            <div className="flex items-start gap-3">
              <Store className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Restoran
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {order.restaurant.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Status Pesanan
          </p>
          <p
            className={`mt-1 inline-block rounded-lg px-3 py-1 text-sm font-semibold ${getOrderStatusColor(
              order.status
            )} bg-blue-50 dark:bg-blue-900/30`}
          >
            {getOrderStatusLabel(order.status)}
          </p>
        </div>
      </div>
    </div>
  );
};
