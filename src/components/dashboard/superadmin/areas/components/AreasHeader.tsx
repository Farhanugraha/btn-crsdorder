'use client';

import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { ViewToggle } from './ViewToggle';
import type { ViewMode } from '../types';

interface AreasHeaderProps {
  showForm: boolean;
  areasCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddClick: () => void;
}

export const AreasHeader = ({
  showForm,
  areasCount,
  viewMode,
  onViewModeChange,
  onAddClick
}: AreasHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/superadmin"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Manajemen Area
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kelola area dan lokasi bisnis Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!showForm && areasCount > 0 && (
              <ViewToggle
                currentMode={viewMode}
                onModeChange={onViewModeChange}
              />
            )}

            {!showForm && (
              <button
                onClick={onAddClick}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Tambah Area</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
