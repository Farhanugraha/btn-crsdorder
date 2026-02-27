'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar = ({
  searchQuery,
  filteredCount,
  onSearchChange,
  onClear
}: SearchBarProps) => {
  return (
    <div className="border-b border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari restoran..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={onClear}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Ditemukan:{' '}
          <span className="font-bold text-slate-900 dark:text-white">
            {filteredCount}
          </span>
        </div>
      </div>
    </div>
  );
};
