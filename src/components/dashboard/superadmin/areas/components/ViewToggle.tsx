'use client';

import { Grid3X3, List } from 'lucide-react';
import type { ViewMode } from '../types';

interface ViewToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ViewToggle = ({
  currentMode,
  onModeChange
}: ViewToggleProps) => {
  return (
    <div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700 sm:flex">
      <button
        onClick={() => onModeChange('grid')}
        className={`rounded p-2 transition-all ${
          currentMode === 'grid'
            ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Grid3X3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => onModeChange('list')}
        className={`rounded p-2 transition-all ${
          currentMode === 'list'
            ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
};
