import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { PaymentItem } from '../types';
import {
  formatCurrency,
  calculateItemTotal
} from '../utils/paymentHelpers';

interface OrderItemsListProps {
  items: PaymentItem[];
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          <ShoppingCart className="h-5 w-5" />
          Item Pesanan
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item, idx) => {
          const itemTotal = calculateItemTotal(
            item.price,
            item.quantity
          );
          const unitPrice = parseInt(item.price);

          return (
            <div
              key={item.id}
              className="flex gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {item.menu?.name || 'Item'}
                </p>
                <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p>
                    Harga Satuan:{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      Rp {formatCurrency(unitPrice)}
                    </span>
                  </p>
                  <p>
                    Jumlah:{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-200">
                      {item.quantity} x
                    </span>
                  </p>
                  {item.notes && (
                    <p className="text-gray-500 dark:text-gray-400">
                      Catatan:{' '}
                      <span className="italic">{item.notes}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                  Subtotal
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  Rp {formatCurrency(itemTotal)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
