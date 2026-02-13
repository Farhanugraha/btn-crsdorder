'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartFooterProps {
  totalPrice: number;
  isUpdating: boolean;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartFooter = ({
  totalPrice,
  isUpdating,
  onClearCart,
  onCheckout
}: CartFooterProps) => {
  return (
    <div className="shrink-0 space-y-4 border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="space-y-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Subtotal
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Rp {totalPrice.toLocaleString('id-ID')}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
          <span className="font-semibold text-slate-900 dark:text-white">
            Total
          </span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            Rp {totalPrice.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          onClick={onClearCart}
          disabled={isUpdating}
          className="h-10 w-full rounded-lg border border-red-200 bg-red-50 font-medium text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Semua
        </Button>
        <Button
          type="button"
          onClick={onCheckout}
          className="h-10 w-full rounded-lg bg-emerald-600 font-medium text-white transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50"
          disabled={isUpdating}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};
