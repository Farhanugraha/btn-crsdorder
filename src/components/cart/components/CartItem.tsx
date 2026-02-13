'use client';

import { Minus, Plus, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from '../types';

interface CartItemProps {
  item: CartItem;
  isUpdating: boolean;
  onRemove: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onEditNotes: (item: CartItem) => void;
}

export const CartItemComponent = ({
  item,
  isUpdating,
  onRemove,
  onUpdateQuantity,
  onEditNotes
}: CartItemProps) => {
  return (
    <div className="group">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50">
        {/* Header: Name and Delete Button */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold text-slate-900 dark:text-white">
            {item.menu.name}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isUpdating}
            className="h-6 w-6 flex-shrink-0 text-slate-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Notes Section with Edit Button */}
        <div className="space-y-2">
          {item.notes ? (
            <div className="flex items-start gap-2">
              <div className="max-h-20 flex-1 overflow-y-auto overflow-x-hidden rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-slate-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-slate-400">
                <p className="whitespace-pre-wrap break-all">
                  <span className="font-medium">💬</span> {item.notes}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isUpdating}
                className="h-6 w-6 flex-shrink-0 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => onEditNotes(item)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-full border-slate-300 text-xs dark:border-slate-600"
              disabled={isUpdating}
              onClick={() => onEditNotes(item)}
            >
              <Edit2 className="mr-1 h-3 w-3" />
              Tambah Catatan
            </Button>
          )}
        </div>

        {/* Price */}
        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          Rp {parseFloat(item.menu.price).toLocaleString('id-ID')}
        </p>

        {/* Quantity Controls */}
        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900">
          <Button
            disabled={item.quantity === 1 || isUpdating}
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() =>
              onUpdateQuantity(item.id, item.quantity - 1)
            }
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="flex-1 text-center text-sm font-bold text-slate-900 dark:text-white">
            Jumlah: {item.quantity}
          </span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            disabled={isUpdating}
            onClick={() =>
              onUpdateQuantity(item.id, item.quantity + 1)
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Subtotal */}
        <div className="border-t border-slate-200 pt-2 text-right text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
          Subtotal: Rp{' '}
          {(parseFloat(item.price) * item.quantity).toLocaleString(
            'id-ID'
          )}
        </div>
      </div>
    </div>
  );
};
