'use client';

import { Filter, Calendar, Download, Loader2 } from 'lucide-react';
import { getModuleDisplayName } from '../utils/moduleHelpers';
import { EXPORT_FORMATS } from '../utils/constants';
import type { ExportFormat } from '../types';

interface ReportsFiltersProps {
  startDate: string;
  endDate: string;
  exportFormat: ExportFormat;
  selectedModule: string;
  isLoading: boolean;
  isExporting: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExportFormatChange: (format: ExportFormat) => void;
  onApplyFilter: () => void;
  onExport: () => void;
  isDateAvailable?: (date: string) => boolean;
}

export const ReportsFilters = ({
  startDate,
  endDate,
  exportFormat,
  selectedModule,
  isLoading,
  isExporting,
  onStartDateChange,
  onEndDateChange,
  onExportFormatChange,
  onApplyFilter,
  onExport,
  isDateAvailable
}: ReportsFiltersProps) => {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
            <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filter & Export Data
          </h3>
        </div>

        {selectedModule && (
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 dark:bg-blue-900/20">
            <div
              className={`h-2 w-2 rounded-full ${
                selectedModule === 'crsd1'
                  ? 'bg-blue-600'
                  : 'bg-emerald-600'
              }`}
            ></div>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              {getModuleDisplayName(selectedModule)}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanggal Mulai
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>
          {isDateAvailable &&
            startDate &&
            !isDateAvailable(startDate) && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Tidak ada data untuk tanggal ini
              </p>
            )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanggal Akhir
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>
          {isDateAvailable &&
            endDate &&
            !isDateAvailable(endDate) && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Tidak ada data untuk tanggal ini
              </p>
            )}
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Format Export
        </label>
        <div className="grid grid-cols-4 gap-2">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.value}
              onClick={() =>
                onExportFormatChange(format.value as ExportFormat)
              }
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                exportFormat === format.value
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md dark:border-blue-500 dark:bg-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={onApplyFilter}
          disabled={isLoading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {isLoading ? 'Memuat...' : 'Terapkan Filter'}
        </button>
        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-lg border border-green-600 bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 dark:border-green-500 dark:bg-green-700 dark:hover:bg-green-600"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {isExporting && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Sedang mengekspor data, mohon tunggu...
        </div>
      )}
    </div>
  );
};
