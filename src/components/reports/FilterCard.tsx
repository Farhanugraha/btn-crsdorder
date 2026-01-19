import { Filter, Download, RefreshCw } from 'lucide-react';

interface FilterCardProps {
  startDate: string;
  endDate: string;
  exportFormat: 'csv' | 'pdf';
  isExporting: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExportFormatChange: (format: 'csv' | 'pdf') => void;
  onApplyFilter: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

export const FilterCard = ({
  startDate,
  endDate,
  exportFormat,
  isExporting,
  onStartDateChange,
  onEndDateChange,
  onExportFormatChange,
  onApplyFilter,
  onExport,
  onRefresh
}: FilterCardProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <Filter className="h-5 w-5" />
        Filter & Export
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
            Tanggal Selesai
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
            Format Export
          </label>
          <select
            value={exportFormat}
            onChange={(e) =>
              onExportFormatChange(e.target.value as 'csv' | 'pdf')
            }
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF (Text)</option>
          </select>
        </div>

        <button
          onClick={onApplyFilter}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Terapkan
        </button>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Export...' : 'Export'}
        </button>
      </div>
    </div>
  );
};
