'use client';

import Link from 'next/link';
import { API_URL } from '../types';
import type { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isToggling: boolean;
  onEdit: (restaurant: Restaurant) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

export const RestaurantCard = ({
  restaurant,
  isToggling,
  onEdit,
  onToggleStatus,
  onDelete
}: RestaurantCardProps) => {
  const isOpen = Boolean(restaurant.is_open);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/50">
      {/* Photo Section */}
      <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={
            restaurant.photo
              ? `${API_URL}/storage/${restaurant.photo}`
              : '/restaurant.png'
          }
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/restaurant.png';
          }}
        />
        {/* Status Badge */}
        <div className="absolute right-3 top-3 flex justify-end">
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
              isOpen
                ? 'bg-emerald-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isOpen ? 'animate-pulse bg-emerald-300' : 'bg-red-300'
              }`}
            />
            {isOpen ? 'Buka' : 'Tutup'}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {restaurant.name}
        </h3>
        <p className="mb-2 text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">
          {restaurant.area?.name}
        </p>
        <p className="mb-3 line-clamp-2 min-h-[32px] text-xs text-slate-500 dark:text-slate-400">
          {restaurant.description}
        </p>

        <div className="mb-4 border-t border-slate-100 pt-3 dark:border-slate-700/50">
          <p className="truncate text-[11px] italic text-slate-400">
            {restaurant.address}
          </p>
        </div>

        <Link
          href={`/dashboard/restaurants/${restaurant.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-blue-600"
        >
          Lihat Menu ({restaurant.menus_count})
        </Link>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-auto flex border-t border-slate-100 bg-slate-50/50 p-1 dark:border-slate-700 dark:bg-slate-800/50">
        <button
          onClick={() => onEdit(restaurant)}
          className="flex-1 rounded-lg py-2.5 text-[10px] font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400"
        >
          Edit
        </button>
        <div className="my-2 w-[1px] bg-slate-200 dark:bg-slate-700" />
        <button
          onClick={() => onToggleStatus(restaurant.id)}
          disabled={isToggling}
          className={`flex-1 rounded-lg py-2.5 text-[10px] font-bold transition-all disabled:opacity-50 ${
            isOpen
              ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
          }`}
        >
          {isToggling ? '...' : isOpen ? 'Tutup Toko' : 'Buka Toko'}
        </button>
        <div className="my-2 w-[1px] bg-slate-200 dark:bg-slate-700" />
        <button
          onClick={() => onDelete(restaurant.id)}
          className="flex-1 rounded-lg py-2.5 text-[10px] font-bold text-slate-500 hover:text-red-600 dark:text-slate-400"
        >
          Hapus
        </button>
      </div>
    </div>
  );
};
