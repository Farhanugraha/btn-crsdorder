'use client';

import { MapPin } from 'lucide-react';
import type { Cart, CartItem } from '../types';
import { CartItemComponent } from './CartItem';

interface RestaurantGroupProps {
  cart: Cart;
  isUpdating: boolean;
  onRemoveItem: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onEditNotes: (item: CartItem) => void;
}

export const RestaurantGroup = ({
  cart,
  isUpdating,
  onRemoveItem,
  onUpdateQuantity,
  onEditNotes
}: RestaurantGroupProps) => {
  const totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="space-y-4">
      {/* Restaurant Header */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/10">
        <h4 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">
          {cart.restaurant?.name ||
            `Restaurant ${cart.restaurant_id}`}
        </h4>
        {cart.restaurant?.address && (
          <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <MapPin className="h-3 w-3" />
            {cart.restaurant.address}
          </p>
        )}
        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          {totalItems} item
        </p>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {cart.items.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            isUpdating={isUpdating}
            onRemove={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
            onEditNotes={onEditNotes}
          />
        ))}
      </div>
    </div>
  );
};
