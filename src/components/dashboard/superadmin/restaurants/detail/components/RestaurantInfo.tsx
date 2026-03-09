'use client';

import { MapPin, Search, X } from 'lucide-react';
import type { Restaurant } from '../types';

interface RestaurantInfoProps {
  restaurant: Restaurant;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const RestaurantInfo = ({
  restaurant,
  searchQuery,
  onSearchChange
}: RestaurantInfoProps) => {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white px-4 py-6 dark:border-slate-700 dark:from-blue-950/30 dark:to-slate-900 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Status Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Status
          </p>
          <div className="mt-2">
            {restaurant.is_open ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 dark:bg-emerald-900/30">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Buka Sekarang
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1.5 dark:bg-slate-700">
                <div className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tutup
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Location Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Lokasi
          </p>
          <div className="mt-2 flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="line-clamp-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {restaurant.address}
            </p>
          </div>
        </div>

        {/* Search Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Cari Menu
          </p>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ketik nama menu..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-400 dark:focus:bg-slate-600"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                aria-label="Hapus pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Mencari:{' '}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                "{searchQuery}"
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
