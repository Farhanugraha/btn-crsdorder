'use client';

import { Edit2, Trash2 } from 'lucide-react';
import type { Area } from '../types';

interface AreaCardProps {
  area: Area;
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
}

export const AreaCard = ({
  area,
  onEdit,
  onDelete
}: AreaCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-900">
      <div className="mb-4 flex items-start justify-between">
        <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
          {area.icon}
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
          #{area.order}
        </span>
      </div>

      <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
        {area.name}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
        {area.description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
        <div className="text-xs">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            ID:
          </span>
          <span className="ml-2 font-mono text-blue-600 dark:text-blue-400">
            {area.slug}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(area)}
            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30"
            title="Edit area"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(area.id)}
            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30"
            title="Hapus area"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
