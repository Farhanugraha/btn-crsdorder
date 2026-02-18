'use client';

import {
  BarChart3,
  Building2,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { getModuleDisplayName } from '../utils/moduleHelpers';

interface ReportsHeaderProps {
  selectedModule: string;
  userDataAccess: string[];
  activeFilterStartDate: string;
  activeFilterEndDate: string;
  onRefresh: () => void;
  onModuleSelectClick: () => void;
  isLoading: boolean;
  hasMultipleAccess: boolean;
}

export const ReportsHeader = ({
  selectedModule,
  userDataAccess,
  activeFilterStartDate,
  activeFilterEndDate,
  onRefresh,
  onModuleSelectClick,
  isLoading,
  hasMultipleAccess
}: ReportsHeaderProps) => {
  return (
    <div className="mb-5 sm:mb-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-2">
              <BarChart3 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                Laporan & Analytics
              </h1>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                {selectedModule === 'general'
                  ? 'Dashboard Umum - Semua Divisi'
                  : selectedModule === 'crsd1'
                    ? 'Divisi CRSD 1'
                    : selectedModule === 'crsd2'
                      ? 'Divisi CRSD 2'
                      : 'Analisis data dan statistik bisnis'}
              </p>
            </div>
          </div>

          {activeFilterStartDate && activeFilterEndDate && (
            <div className="mt-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Periode: {activeFilterStartDate} -{' '}
                {activeFilterEndDate}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {/* Tampilkan button modul hanya jika user punya multiple access */}
          {hasMultipleAccess && (
            <button
              onClick={onModuleSelectClick}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>
                {selectedModule ? 'Ganti Modul' : 'Pilih Modul'}
              </span>
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:px-3.5 sm:py-2 sm:text-sm"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isLoading ? 'animate-spin' : ''
              } sm:h-4 sm:w-4`}
            />
            <span className="hidden sm:inline">Refresh</span>
            <span className="inline sm:hidden">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
