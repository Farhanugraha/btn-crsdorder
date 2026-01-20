import { Filter, Download, RefreshCw } from 'lucide-react';

interface FilterCardProps {
  startDate: string;
  endDate: string;
  exportFormat: 'csv' | 'pdf' | 'excel' | 'txt';
  isExporting: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExportFormatChange: (
    format: 'csv' | 'pdf' | 'excel' | 'txt'
  ) => void;
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
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <Filter className="h-5 w-5" />
        Filter & Export
      </h2>

      <div className="space-y-4">
        {/* Date Inputs Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col">
            <label className="mb-2 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={today}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              max={today}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              Format Export
            </label>
            <select
              value={exportFormat}
              onChange={(e) =>
                onExportFormatChange(
                  e.target.value as 'csv' | 'pdf' | 'excel' | 'txt'
                )
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.XLSX)</option>
              <option value="csv">CSV</option>
              <option value="txt">TXT (Text)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onApplyFilter}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Filter className="h-4 w-4" />
            Terapkan
          </button>

          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Export...' : 'Export'}
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};
