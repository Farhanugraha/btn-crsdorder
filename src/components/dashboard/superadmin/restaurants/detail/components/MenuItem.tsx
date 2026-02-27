'use client';

import { Edit2, Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import type { Menu } from '../types';

interface MenuItemProps {
  menu: Menu;
  isToggling: boolean;
  onEdit: (menu: Menu) => void;
  onToggleAvailability: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  formatCurrency: (price: number) => string;
  getImageSrc: (image: string | null) => string;
}

export const MenuItem = ({
  menu,
  isToggling,
  onEdit,
  onToggleAvailability,
  onDelete,
  formatCurrency,
  getImageSrc
}: MenuItemProps) => {
  return (
    <div
      className={`group flex flex-col gap-4 p-4 transition-all last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 sm:flex-row sm:items-center sm:gap-4 sm:p-6 ${
        !menu.is_available ? 'opacity-60' : ''
      }`}
    >
      {/* Image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
        <img
          src={getImageSrc(menu.image)}
          alt={menu.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/foodimages.png';
          }}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
          {menu.name}
        </h3>
        <p className="mt-1.5 text-lg font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(menu.price)}
        </p>

        {/* Status Badge */}
        <div className="mt-2.5">
          {menu.is_available ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Tersedia
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Tidak Tersedia
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-shrink-0 gap-1.5 sm:gap-2">
        <button
          onClick={() => onEdit(menu)}
          className="rounded-lg p-2.5 text-blue-600 transition-colors hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40"
          title="Edit"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            onToggleAvailability(menu.id, menu.is_available)
          }
          disabled={isToggling}
          className="rounded-lg p-2.5 text-amber-600 transition-colors hover:bg-amber-100 disabled:opacity-50 dark:text-amber-400 dark:hover:bg-amber-900/40"
          title={
            menu.is_available
              ? 'Tandai tidak tersedia'
              : 'Tandai tersedia'
          }
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : menu.is_available ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => onDelete(menu.id)}
          className="rounded-lg p-2.5 text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40"
          title="Hapus"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
