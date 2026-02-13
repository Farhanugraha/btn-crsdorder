'use client';

import { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { DATE_PRESETS } from '../utils/constants';
import { getTodayDate } from '../utils/paymentUtils';
import type { DateRange } from '../types';

interface PaymentsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  datePreset: string;
  onDatePresetChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onTodayFilter: () => void;
}

export const PaymentsFilters = ({
  search,
  onSearchChange,
  datePreset,
  onDatePresetChange,
  dateRange,
  onDateRangeChange,
  onTodayFilter
}: PaymentsFiltersProps) => {
  const [showAdvancedDate, setShowAdvancedDate] = useState(false);

  const todayDate = getTodayDate();

  return (
    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
      {/* SEARCH BAR */}
      <div className="mb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari transaksi, kode order, atau nama pelanggan..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* FILTER PERIODE WAKTU */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Date Preset Filter */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Periode Waktu
          </label>
          <div className="relative">
            <select
              value={datePreset}
              onChange={(e) => onDatePresetChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {DATE_PRESETS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Aksi Cepat
          </label>
          <div className="flex gap-2">
            <button
              onClick={onTodayFilter}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                datePreset === 'today' &&
                !dateRange.start &&
                !dateRange.end
                  ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setShowAdvancedDate(!showAdvancedDate)}
              className="flex items-center justify-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Range</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Date Range Picker */}
      {showAdvancedDate && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Filter Rentang Tanggal
            </h4>
            <button
              onClick={() => setShowAdvancedDate(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  onDateRangeChange({
                    ...dateRange,
                    start: e.target.value
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                max={todayDate}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  onDateRangeChange({
                    ...dateRange,
                    end: e.target.value
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                max={todayDate}
                min={dateRange.start || undefined}
              />
            </div>
          </div>
          {(dateRange.start || dateRange.end) && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() =>
                  onDateRangeChange({ start: '', end: '' })
                }
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Hapus Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
