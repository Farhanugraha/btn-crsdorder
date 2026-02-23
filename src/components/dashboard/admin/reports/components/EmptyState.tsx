'use client';

import { FileText, RefreshCw, LayoutDashboard } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onRefresh: () => void;
  onModuleSelect?: () => void;
}

export const EmptyState = ({
  title = 'Tidak Ada Data',
  description = 'Belum ada data untuk ditampilkan pada periode ini',
  icon,
  onRefresh,
  onModuleSelect
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-lg dark:bg-gray-800">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-700">
        {icon || (
          <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        )}
      </div>

      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
        {description}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>

        {onModuleSelect && (
          <button
            onClick={onModuleSelect}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <LayoutDashboard className="h-4 w-4" />
            Ganti Modul
          </button>
        )}
      </div>
    </div>
  );
};
