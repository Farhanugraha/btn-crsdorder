'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { RestaurantGroup } from './RestaurantGroup';
import { CartFooter } from './CartFooter';
import type { Cart, CartItem } from '../types';

interface CartWithItemsProps {
  cartsWithItems: Cart[];
  totalCartPrice: number;
  isUpdating: boolean;
  onRemoveItem: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onEditNotes: (item: CartItem) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartWithItems = ({
  cartsWithItems,
  totalCartPrice,
  isUpdating,
  onRemoveItem,
  onUpdateQuantity,
  onEditNotes,
  onClearCart,
  onCheckout
}: CartWithItemsProps) => {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="space-y-6 px-4 py-4 pb-32">
          {cartsWithItems.map((cart) => (
            <RestaurantGroup
              key={cart.id}
              cart={cart}
              isUpdating={isUpdating}
              onRemoveItem={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
              onEditNotes={onEditNotes}
            />
          ))}
        </div>
      </ScrollArea>

      <CartFooter
        totalPrice={totalCartPrice}
        isUpdating={isUpdating}
        onClearCart={onClearCart}
        onCheckout={onCheckout}
      />
    </div>
  );
};
