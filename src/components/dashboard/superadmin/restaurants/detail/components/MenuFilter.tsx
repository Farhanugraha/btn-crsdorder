'use client';

import { ChefHat } from 'lucide-react';
import type { FilterStatus } from '../types';

interface MenuFilterProps {
  totalMenus: number;
  availableCount: number;
  unavailableCount: number;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
}

export const MenuFilter = ({
  totalMenus,
  availableCount,
  unavailableCount,
  filterStatus,
  onFilterChange
}: MenuFilterProps) => {
  return (
    <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/40 dark:to-blue-900/20 sm:px-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/50">
            <ChefHat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Daftar Menu
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Total: {totalMenus} menu
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => onFilterChange('all')}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all sm:text-sm ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
            }`}
          >
            Semua ({totalMenus})
          </button>
          <button
            onClick={() => onFilterChange('available')}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all sm:text-sm ${
              filterStatus === 'available'
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
            }`}
          >
            Tersedia ({availableCount})
          </button>
          <button
            onClick={() => onFilterChange('unavailable')}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all sm:text-sm ${
              filterStatus === 'unavailable'
                ? 'bg-red-600 text-white'
                : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
            }`}
          >
            Tidak ({unavailableCount})
          </button>
        </div>
      </div>
    </div>
  );
};
