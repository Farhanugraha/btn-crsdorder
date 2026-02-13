'use client';

import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStatusConfig } from '../constants/orderConstants';
import {
  formatDate,
  formatPrice,
  getItemDisplayName,
  getItemPrice,
  getRestaurantName
} from '../utils/orderUtils';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onClick: (orderId: number) => void;
}

export const OrderCard = ({ order, onClick }: OrderCardProps) => {
  const statusConfig = getStatusConfig(
    order.status,
    order.order_status
  );
  const StatusIcon = statusConfig.icon;
  const restaurantName = getRestaurantName(order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div
        onClick={() => onClick(order.id)}
        className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-white/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30 dark:hover:border-emerald-600"
      >
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                >
                  <StatusIcon className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">
                    {statusConfig.label}
                  </span>
                  <span className="sm:hidden">
                    {statusConfig.label.split(' ')[0]}
                  </span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                {order.order_code}
              </h3>
              {restaurantName && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                  {restaurantName}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                Total
              </p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 sm:text-xl">
                {formatPrice(order.total_price)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${statusConfig.progress}%` }}
              />
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-slate-700 dark:text-slate-300 sm:text-sm">
              Pesanan ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="truncate text-slate-600 dark:text-slate-400">
                    {getItemDisplayName(item)} × {item.quantity}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatPrice(getItemPrice(item))}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  +{order.items.length - 2} item lainnya
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mb-4 rounded-lg bg-slate-50/50 p-3 dark:bg-slate-800/50">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                  <span className="font-medium">Catatan: </span>
                  {order.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
