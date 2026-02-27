'use client';

import Link from 'next/link';
import { API_URL } from '../types';
import type { Restaurant } from '../types';

interface RestaurantListItemProps {
  restaurant: Restaurant;
  isToggling: boolean;
  onEdit: (restaurant: Restaurant) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

export const RestaurantListItem = ({
  restaurant,
  isToggling,
  onEdit,
  onToggleStatus,
  onDelete
}: RestaurantListItemProps) => {
  const isOpen = Boolean(restaurant.is_open);

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      {/* Photo */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
        <img
          src={
            restaurant.photo
              ? `${API_URL}/storage/${restaurant.photo}`
              : '/restaurant.png'
          }
          alt={restaurant.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/restaurant.png';
          }}
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {restaurant.name}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              isOpen
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {isOpen ? 'Buka' : 'Tutup'}
          </span>
        </div>
        <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
          {restaurant.area?.name}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="italic">{restaurant.address}</span>
          <span className="font-bold text-slate-600 dark:text-slate-300">
            • {restaurant.menus_count} Menu
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-700 sm:border-0 sm:pt-0">
        <Link
          href={`/dashboard/restaurants/${restaurant.id}`}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
        >
          Detail
        </Link>
        <div className="flex gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-700/50">
          <button
            onClick={() => onEdit(restaurant)}
            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-white hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-600"
          >
            Edit
          </button>
          <button
            onClick={() => onToggleStatus(restaurant.id)}
            disabled={isToggling}
            className={`rounded-lg px-3 py-2 text-xs font-bold hover:bg-white dark:hover:bg-slate-600 ${
              isOpen ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {isToggling ? '...' : isOpen ? 'Tutup Toko' : 'Buka Toko'}
          </button>
          <button
            onClick={() => onDelete(restaurant.id)}
            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-white hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
