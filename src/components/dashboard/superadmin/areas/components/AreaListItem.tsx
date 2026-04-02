'use client';

import { Edit2, Trash2 } from 'lucide-react';
import type { Area } from '../types';

interface AreaListItemProps {
  area: Area;
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
}

export const AreaListItem = ({
  area,
  onEdit,
  onDelete,
  onToggleActive
}: AreaListItemProps) => {
  return (
    <div
      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all ${
        area.is_active
          ? 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700/30'
          : 'border-dashed border-slate-300 bg-slate-50/80 dark:border-slate-600 dark:bg-slate-800/20'
      }`}
    >
      {/* Icon */}
      <div
        className={`text-3xl ${!area.is_active ? 'opacity-40 grayscale' : ''}`}
      >
        {area.icon}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`text-sm font-bold ${
              area.is_active
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {area.name}
          </h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            #{area.order}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              area.is_active
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${area.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}
            />
            {area.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
        <p
          className={`mt-1 truncate text-sm ${
            area.is_active
              ? 'text-slate-600 dark:text-slate-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {area.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Toggle Switch */}
        <button
          onClick={() => onToggleActive(area.id)}
          title={
            area.is_active ? 'Nonaktifkan area' : 'Aktifkan area'
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            area.is_active
              ? 'bg-emerald-500 focus:ring-emerald-500 dark:focus:ring-offset-slate-800'
              : 'bg-slate-300 focus:ring-slate-400 dark:bg-slate-600 dark:focus:ring-offset-slate-800'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
              area.is_active ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>

        {/* Edit & Delete — muncul saat hover */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(area)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(area.id)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-red-700 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
