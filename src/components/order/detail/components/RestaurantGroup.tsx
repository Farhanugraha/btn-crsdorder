'use client';

import { MapPin, Phone } from 'lucide-react';
import type { Restaurant, OrderItem } from '../types';
import { OrderItemsList } from './OrderItemsList';

interface RestaurantGroupProps {
  restaurant: Restaurant | undefined;
  items: OrderItem[];
  subtotal: number;
}

export const RestaurantGroup = ({
  restaurant,
  items,
  subtotal
}: RestaurantGroupProps) => {
  return (
    <div className="space-y-3 border-b border-slate-200 pb-4 last:border-b-0 dark:border-slate-700">
      {/* Restaurant Header */}
      {restaurant && (
        <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-3 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/10">
          <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
            {restaurant.name}
          </h3>
          {restaurant.address && (
            <div className="flex gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {restaurant.address}
              </p>
            </div>
          )}
          {restaurant.phone && (
            <div className="mt-1 flex gap-2">
              <Phone className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {restaurant.phone}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Items for this restaurant */}
      <OrderItemsList items={items} />

      {/* Subtotal per restaurant */}
      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Subtotal
          </p>
          <p className="font-semibold text-slate-900 dark:text-white">
            Rp {subtotal.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};
