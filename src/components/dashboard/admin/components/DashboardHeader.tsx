'use client';

import { RefreshCw } from 'lucide-react';
import { formatFullDate } from '../utils/formatters';

interface DashboardHeaderProps {
  filterStatus: string;
  isRefreshing: boolean;
  onStatusChange: (status: string) => void;
  onRefresh: () => void;
}

export const DashboardHeader = ({
  filterStatus,
  isRefreshing,
  onStatusChange,
  onRefresh
}: DashboardHeaderProps) => {
  return (
    <div className="border-b border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Admin
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {formatFullDate(new Date())}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="processing">Menunggu Diproses</option>
                <option value="completed">Selesai</option>
                <option value="canceled">Dibatalkan</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronDownIcon />
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600 sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function ChevronDownIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
