'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { ShoppingCart } from 'lucide-react';
import { CartTrigger } from './CartTrigger';
import { CartEmpty } from './CartEmpty';
import { CartWithItems } from './CartWithItems';
import { CartLoadingState } from './LoadingState';
import type { Cart, CartItem } from '../types';

interface CartSheetProps {
  mounted: boolean;
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  cartsWithItems: Cart[];
  totalCartItems: number;
  totalCartPrice: number;
  isLoading: boolean;
  isUpdating: boolean;
  onRemoveItem: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onEditNotes: (item: CartItem) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartSheet = ({
  mounted,
  sheetOpen,
  onSheetOpenChange,
  cartsWithItems,
  totalCartItems,
  totalCartPrice,
  isLoading,
  isUpdating,
  onRemoveItem,
  onUpdateQuantity,
  onEditNotes,
  onClearCart,
  onCheckout
}: CartSheetProps) => {
  return (
    <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
      <SheetTrigger asChild>
        <CartTrigger totalItems={totalCartItems} mounted={mounted} />
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-slate-900 sm:w-96">
        <SheetHeader className="flex-shrink-0 border-b border-slate-200 pb-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-emerald-600" />
            <SheetTitle className="text-xl">Keranjang</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {mounted ? (
            cartsWithItems.length === 0 ? (
              <CartEmpty />
            ) : (
              <CartWithItems
                cartsWithItems={cartsWithItems}
                totalCartPrice={totalCartPrice}
                isUpdating={isUpdating}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                onEditNotes={onEditNotes}
                onClearCart={onClearCart}
                onCheckout={onCheckout}
              />
            )
          ) : (
            <CartLoadingState />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
