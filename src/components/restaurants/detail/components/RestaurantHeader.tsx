'use client';

import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '../types';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  areaId: number | null;
  onBack: () => void;
}

export const RestaurantHeader = ({
  restaurant,
  areaId,
  onBack
}: RestaurantHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="group -ml-2 mb-4 gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali
        </Button>

        {/* Restaurant Info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            {restaurant.area && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">
                  {restaurant.area.icon || '📍'}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  {restaurant.area.name}
                </span>
              </div>
            )}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {restaurant.name}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              {restaurant.description}
            </p>

            {/* Info Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span className="line-clamp-1 font-medium">
                  {restaurant.address}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                {restaurant.menus_count} Menu
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {restaurant.is_open ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Buka
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:ring-slate-700">
                Tutup
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
