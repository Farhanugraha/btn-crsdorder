'use client';

import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FilterType } from '../types';

interface StatisticsFiltersProps {
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
  customStartDate: string;
  customEndDate: string;
  onCustomStartDateChange: (date: string) => void;
  onCustomEndDateChange: (date: string) => void;
  onCustomDateFilter: () => void;
  filterOptions: Array<{ key: FilterType; label: string }>;
  error?: string | null;
}

export const StatisticsFilters = ({
  filterType,
  onFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onCustomDateFilter,
  filterOptions,
  error
}: StatisticsFiltersProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 dark:bg-gray-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filter Periode
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(({ key, label }) => (
            <Button
              key={key}
              onClick={() => onFilterChange(key)}
              variant={filterType === key ? 'default' : 'outline'}
              size="sm"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {filterType === 'kustom' && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) =>
                  onCustomStartDateChange(e.target.value)
                }
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) =>
                  onCustomEndDateChange(e.target.value)
                }
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={onCustomDateFilter}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Terapkan Filter
              </Button>
            </div>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
