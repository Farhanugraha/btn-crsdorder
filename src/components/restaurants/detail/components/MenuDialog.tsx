'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import {
  formatCurrency,
  calculateTotalPrice,
  getImageUrl
} from '../utils/restaurantUtils';
import type { Menu } from '../types';

interface MenuDialogProps {
  menu: Menu;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quantity: number;
  notes: string;
  isAddingToCart: boolean;
  apiUrl: string;
  onQuantityChange: (menuId: number, quantity: number) => void;
  onNotesChange: (menuId: number, notes: string) => void;
  onAddToCart: (menu: Menu) => void;
}

export const MenuDialog = ({
  menu,
  open,
  onOpenChange,
  quantity,
  notes,
  isAddingToCart,
  apiUrl,
  onQuantityChange,
  onNotesChange,
  onAddToCart
}: MenuDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-none bg-white p-0 dark:bg-slate-900">
        {/* Image */}
        <div className="relative h-56 bg-slate-100 dark:bg-slate-800">
          <img
            src={getImageUrl(menu.image, apiUrl)}
            alt={menu.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/foodimages.png';
            }}
          />
        </div>

        {/* Content */}
        <div className="space-y-5 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {menu.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Catatan Khusus
              </label>
              <textarea
                value={notes}
                onChange={(e) =>
                  onNotesChange(menu.id, e.target.value)
                }
                placeholder="Contoh: Tidak pakai pedas..."
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:placeholder:text-slate-500"
                rows={2}
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Jumlah
              </span>
              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={quantity === 1}
                  onClick={() =>
                    onQuantityChange(menu.id, quantity - 1)
                  }
                  className="h-7 w-7 rounded-full p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-4 text-center text-sm font-bold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onQuantityChange(menu.id, quantity + 1)
                  }
                  className="h-7 w-7 rounded-full p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Total
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  Rp {calculateTotalPrice(menu.price, quantity)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="h-10 w-full rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              onClick={() => onAddToCart(menu)}
              disabled={!menu.is_available || isAddingToCart}
            >
              <ShoppingCart className="mr-2 h-3.5 w-3.5" />
              {isAddingToCart
                ? 'Menambahkan...'
                : 'Tambah ke Keranjang'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
