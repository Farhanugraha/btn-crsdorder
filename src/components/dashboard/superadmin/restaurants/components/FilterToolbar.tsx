'use client';

import { ChevronDown } from 'lucide-react';
import type { Area, FilterStatus } from '../types';

interface FilterToolbarProps {
  filterStatus: FilterStatus;
  filterArea: string | number;
  areas: Area[];
  openCount: number;
  closedCount: number;
  totalCount: number;
  onStatusChange: (status: FilterStatus) => void;
  onAreaChange: (value: string | number) => void;
}

export const FilterToolbar = ({
  filterStatus,
  filterArea,
  areas,
  openCount,
  closedCount,
  totalCount,
  onStatusChange,
  onAreaChange
}: FilterToolbarProps) => {
  return (
    <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
      <div className="space-y-5">
        {/* Title & Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-sm dark:bg-blue-500/10"></div>
              <div className="relative rounded-xl bg-blue-600 p-2.5 shadow-lg shadow-blue-200 dark:bg-blue-600 dark:shadow-none">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l14-4"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-blue-900 dark:text-white">
                Daftar Restoran
              </h2>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total: {totalCount} restoran
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Segmented Control */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/50 p-1.5 dark:border-slate-700 dark:bg-slate-800/50">
            <button
              onClick={() => onStatusChange('all')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all sm:flex-none ${
                filterStatus === 'all'
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-white dark:ring-slate-600'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <span>Semua</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                  filterStatus === 'all'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => onStatusChange('open')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all sm:flex-none ${
                filterStatus === 'open'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none'
                  : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400'
              }`}
            >
              <span>Buka</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                  filterStatus === 'open'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                {openCount}
              </span>
            </button>

            <button
              onClick={() => onStatusChange('closed')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all sm:flex-none ${
                filterStatus === 'closed'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-none'
                  : 'text-slate-500 hover:text-red-600 dark:text-slate-400'
              }`}
            >
              <span>Tutup</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                  filterStatus === 'closed'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                {closedCount}
              </span>
            </button>
          </div>

          {/* Area Selector */}
          <div className="relative">
            <select
              value={filterArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-xs font-bold text-slate-700 shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-48"
            >
              <option value="all">Semua Area</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.icon} {area.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
