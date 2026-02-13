'use client';

import { X, Calendar } from 'lucide-react';
import { DATE_PRESETS } from '../utils/constants';
import { getTodayDate } from '../utils/paymentUtils';
import type { DateRange } from '../types';

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  datePreset: string;
  onDatePresetChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onTodayFilter: () => void;
  onReset: () => void;
}

export const MobileFilters = ({
  isOpen,
  onClose,
  datePreset,
  onDatePresetChange,
  dateRange,
  onDateRangeChange,
  onTodayFilter,
  onReset
}: MobileFiltersProps) => {
  if (!isOpen) return null;

  const todayDate = getTodayDate();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 lg:hidden"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Filter Periode
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Date Filter */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-semibold text-gray-900 dark:text-white">
            Periode Waktu
          </label>
          <div className="space-y-3">
            {/* Button Hari Ini */}
            <button
              onClick={() => {
                onTodayFilter();
                onClose();
              }}
              className={`w-full rounded-lg py-3 text-sm font-medium transition-all ${
                datePreset === 'today' &&
                !dateRange.start &&
                !dateRange.end
                  ? 'bg-blue-600 text-white dark:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Hari Ini
            </button>

            {/* Date Presets */}
            <select
              value={datePreset}
              onChange={(e) => {
                onDatePresetChange(e.target.value);
                onClose();
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {DATE_PRESETS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <div className="space-y-2 pt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Atau pilih rentang tanggal:
              </p>
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => {
                    onDateRangeChange({
                      ...dateRange,
                      start: e.target.value
                    });
                  }}
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
                  onChange={(e) => {
                    onDateRangeChange({
                      ...dateRange,
                      end: e.target.value
                    });
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  max={todayDate}
                  min={dateRange.start || undefined}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            onReset();
            onClose();
          }}
          className="w-full rounded-lg bg-red-50 py-3 text-sm font-medium text-red-700 transition-all hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
        >
          Reset ke Hari Ini
        </button>
      </div>
    </div>
  );
};
