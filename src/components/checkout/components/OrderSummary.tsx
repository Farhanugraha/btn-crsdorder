'use client';

import { MapPin } from 'lucide-react';
import type { OrderItem, Restaurant } from '../types';

interface OrderSummaryProps {
  groupedItems: Record<number, OrderItem[]>;
  restaurants: Map<number, Restaurant>;
  totalPrice: number;
}

export const OrderSummary = ({
  groupedItems,
  restaurants,
  totalPrice
}: OrderSummaryProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <h2 className="mb-4 text-lg font-bold text-blue-900 dark:text-white sm:text-xl">
        Ringkasan Pesanan
      </h2>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([restoId, items]) => {
          const resto = restaurants.get(parseInt(restoId));
          const restoSubtotal = items.reduce(
            (sum, item) =>
              sum + parseFloat(item.price) * item.quantity,
            0
          );

          return (
            <div
              key={restoId}
              className="space-y-3 border-b border-slate-200 pb-4 last:border-b-0 dark:border-slate-700"
            >
              {resto && (
                <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-3 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/10">
                  <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {resto.name}
                  </h3>
                  {resto.address && (
                    <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {resto.address}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-700"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                        {item.menu?.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Rp{' '}
                        {parseFloat(item.price).toLocaleString(
                          'id-ID'
                        )}{' '}
                        × {item.quantity}
                      </p>
                      {item.notes && (
                        <p className="mt-1 text-xs italic text-blue-600 dark:text-blue-400">
                          💬 {item.notes}
                        </p>
                      )}
                    </div>
                    <p className="ml-2 flex-shrink-0 text-right font-semibold text-slate-900 dark:text-white">
                      Rp{' '}
                      {(
                        parseFloat(item.price) * item.quantity
                      ).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Subtotal
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                    Rp {restoSubtotal.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white sm:text-lg">
            Total Keseluruhan
          </span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
            Rp {totalPrice.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
};
