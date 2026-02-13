'use client';

import { forwardRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartTriggerProps {
  totalItems: number;
  mounted: boolean;
  onClick?: () => void;
}

export const CartTrigger = forwardRef<
  HTMLButtonElement,
  CartTriggerProps
>(({ totalItems, mounted, onClick }, ref) => {
  return (
    <Button
      ref={ref}
      size="icon"
      variant="outline"
      onClick={onClick}
      className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <ShoppingCart className="h-5 w-5" />
      {mounted && totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Button>
  );
});

CartTrigger.displayName = 'CartTrigger';
