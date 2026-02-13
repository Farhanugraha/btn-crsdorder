'use client';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  formatCurrency,
  getImageUrl
} from '../utils/restaurantUtils';
import type { Menu } from '../types';

interface MenuCardProps {
  menu: Menu;
  isLoggedIn: boolean;
  apiUrl: string;
  onToggleDialog: (menuId: number) => void;
  onLoginRedirect: () => void;
}

export const MenuCard = ({
  menu,
  isLoggedIn,
  apiUrl,
  onToggleDialog,
  onLoginRedirect
}: MenuCardProps) => {
  const isAvailable = menu.is_available && isLoggedIn;

  const handleClick = () => {
    if (!isLoggedIn) {
      toast.error('Silakan login terlebih dahulu');
      onLoginRedirect();
      return;
    }
    if (!menu.is_available) {
      toast.error('Menu tidak tersedia');
      return;
    }
    onToggleDialog(menu.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
        isAvailable
          ? 'cursor-pointer border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
          : 'cursor-default border-slate-300 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800/50'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={getImageUrl(menu.image, apiUrl)}
          alt={menu.name}
          className={`h-full w-full object-cover transition-transform duration-500 ${
            isAvailable ? 'group-hover:scale-105' : ''
          }`}
          onError={(e) => {
            e.currentTarget.src = '/foodimages.png';
          }}
        />
        {!menu.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-900">
              Tidak Tersedia
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-1.5 line-clamp-2 text-xs font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:text-sm">
          {menu.name}
        </h3>

        <div className="mt-auto space-y-2">
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(menu.price)}
          </p>
          <button
            disabled={!menu.is_available || !isLoggedIn}
            className={`flex h-8 w-full items-center justify-center gap-1 rounded-lg text-xs font-bold transition-all ${
              !menu.is_available || !isLoggedIn
                ? 'cursor-not-allowed bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <Plus className="h-3 w-3" />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
};
