'use client';

import { Edit2, Trash2 } from 'lucide-react';
import type { Area } from '../types';

interface AreaListItemProps {
  area: Area;
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
}

export const AreaListItem = ({
  area,
  onEdit,
  onDelete
}: AreaListItemProps) => {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700/30">
      <div className="text-3xl">{area.icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {area.name}
          </h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
            #{area.order}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">
          {area.description}
        </p>
      </div>
      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(area)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-700"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(area.id)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
