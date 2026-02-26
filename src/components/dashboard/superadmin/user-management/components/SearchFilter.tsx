import React from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { FilterRole } from '../types';
import { ROLE_OPTIONS, PER_PAGE_OPTIONS } from '../constants';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: FilterRole;
  onFilterChange: (value: FilterRole) => void;
  perPage: number;
  onPerPageChange: (value: number) => void;
  showFilterPanel: boolean;
  onToggleFilterPanel: () => void;
  totalUsers: number;
  onReset?: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterChange,
  perPage,
  onPerPageChange,
  showFilterPanel,
  onToggleFilterPanel,
  totalUsers,
  onReset
}) => {
  const hasActiveFilters = searchTerm || filterRole !== 'all';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="p-4">
        {/* Search Bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, atau telepon..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-20 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-800"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden items-center gap-2 sm:flex">
            <select
              value={filterRole}
              onChange={(e) =>
                onFilterChange(e.target.value as FilterRole)
              }
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={perPage}
              onChange={(e) =>
                onPerPageChange(Number(e.target.value))
              }
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {PER_PAGE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value} / halaman
                </option>
              ))}
            </select>

            {hasActiveFilters && onReset && (
              <button
                onClick={onReset}
                className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={onToggleFilterPanel}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 sm:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Filter {hasActiveFilters && '(Aktif)'}
            </span>
          </button>
        </div>

        {/* Mobile Filter Panel */}
        {showFilterPanel && (
          <div className="animate-slide-down mt-4 space-y-4 sm:hidden">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onFilterChange(option.value)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      filterRole === option.value
                        ? `bg-gradient-to-r from-${option.color}-600 to-${option.color}-700 text-white shadow-lg`
                        : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tampilkan
              </label>
              <select
                value={perPage}
                onChange={(e) =>
                  onPerPageChange(Number(e.target.value))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                {PER_PAGE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value} per halaman
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && onReset && (
              <button
                onClick={onReset}
                className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        )}

        {/* Info Bar */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {totalUsers}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              pengguna
            </span>
          </div>

          {hasActiveFilters && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Filter aktif
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
