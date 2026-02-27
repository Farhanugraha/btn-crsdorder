'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Grid3X3, List } from 'lucide-react';
import type { ViewMode } from '../types';

interface RestaurantsHeaderProps {
  showForm: boolean;
  restaurantsCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddClick: () => void;
}

export const RestaurantsHeader = ({
  showForm,
  restaurantsCount,
  viewMode,
  onViewModeChange,
  onAddClick
}: RestaurantsHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-700 dark:bg-slate-900/80">
      <div className="px-3 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/superadmin"
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 sm:h-9 sm:w-9"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
            <div className="min-w-0">
              <p className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:block">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <h1 className="text-sm font-bold text-blue-900 dark:text-white sm:text-lg">
                Manajemen Restoran
              </h1>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            {!showForm && restaurantsCount > 0 && (
              <div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 sm:flex">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`rounded p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`rounded p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            )}
            {!showForm && (
              <button
                onClick={onAddClick}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Tambah Restoran
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
