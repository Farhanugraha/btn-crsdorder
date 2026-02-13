'use client';

import type { OrderItem } from '../types';
import { formatPrice } from '../utils/orderDetailUtils';

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList = ({ items }: OrderItemsListProps) => {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between py-2">
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">
              {item.menu?.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Rp {formatPrice(item.price)} × {item.quantity}
            </p>
            {item.notes && (
              <p className="mt-1 text-xs italic text-blue-600 dark:text-blue-400">
                💬 {item.notes}
              </p>
            )}
          </div>
          <p className="ml-2 font-semibold text-slate-900 dark:text-white">
            Rp {formatPrice(parseFloat(item.price) * item.quantity)}
          </p>
        </div>
      ))}
    </div>
  );
};
