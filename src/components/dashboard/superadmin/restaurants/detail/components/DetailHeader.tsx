'use client';

import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import type { Restaurant } from '../types';

interface DetailHeaderProps {
  restaurant: Restaurant;
  showForm: boolean;
  onAddClick: () => void;
}

export const DetailHeader = ({
  restaurant,
  showForm,
  onAddClick
}: DetailHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              href="/dashboard/restaurants"
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {restaurant.area?.icon} {restaurant.area?.name}
              </p>
              <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                {restaurant.name}
              </h1>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={onAddClick}
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800 sm:px-4"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tambah Menu</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
