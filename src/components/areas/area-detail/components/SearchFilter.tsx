'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FILTER_BUTTONS,
  getStatusButtonClass
} from '../constants/filterOptions';
import type { FilterStatus } from '../types';

interface SearchFilterProps {
  searchQuery: string;
  filterStatus: FilterStatus;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: FilterStatus) => void;
}

export const SearchFilter = ({
  searchQuery,
  filterStatus,
  onSearchChange,
  onStatusChange
}: SearchFilterProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4 sm:h-5 sm:w-5" />
          <Input
            type="text"
            placeholder="Cari restoran..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-lg border-slate-300 bg-white pl-9 text-sm placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-400 sm:h-10 sm:rounded-xl sm:pl-12 sm:text-base"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {FILTER_BUTTONS.map((btn) => (
              <button
                key={btn.id}
                onClick={() => onStatusChange(btn.id)}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:shadow-sm sm:px-3 sm:py-2 sm:text-sm ${getStatusButtonClass(
                  filterStatus,
                  btn.id
                )}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
