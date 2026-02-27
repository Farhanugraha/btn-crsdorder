'use client';

import { ChefHat, Plus } from 'lucide-react';
import { MenuItem } from './MenuItem';
import { MenuListSkeleton } from './skeleton/MenuListSkeleton';
import type { Menu } from '../types';

interface MenuListProps {
  menus: Menu[];
  isLoading: boolean;
  filterStatus: string;
  togglingId: number | null;
  totalMenus: number;
  onEdit: (menu: Menu) => void;
  onToggleAvailability: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  onAddFirst: () => void;
  formatCurrency: (price: number) => string;
  getImageSrc: (image: string | null) => string;
}

export const MenuList = ({
  menus,
  isLoading,
  filterStatus,
  togglingId,
  totalMenus,
  onEdit,
  onToggleAvailability,
  onDelete,
  onAddFirst,
  formatCurrency,
  getImageSrc
}: MenuListProps) => {
  if (isLoading) {
    return <MenuListSkeleton count={5} />;
  }

  if (menus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <ChefHat className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {filterStatus === 'available'
            ? 'Tidak ada menu tersedia'
            : filterStatus === 'unavailable'
              ? 'Tidak ada menu tidak tersedia'
              : 'Menu Kosong'}
        </h3>
        <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400">
          {totalMenus === 0
            ? 'Tambahkan menu pertama untuk memulai'
            : 'Ubah filter untuk melihat menu lain'}
        </p>
        {totalMenus === 0 && (
          <button
            onClick={onAddFirst}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            Tambah Menu Pertama
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {menus.map((menu) => (
        <MenuItem
          key={menu.id}
          menu={menu}
          isToggling={togglingId === menu.id}
          onEdit={onEdit}
          onToggleAvailability={onToggleAvailability}
          onDelete={onDelete}
          formatCurrency={formatCurrency}
          getImageSrc={getImageSrc}
        />
      ))}
    </div>
  );
};
