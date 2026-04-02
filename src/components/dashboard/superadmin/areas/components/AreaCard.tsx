'use client';

import { Edit2, Trash2 } from 'lucide-react';
import type { Area } from '../types';

interface AreaCardProps {
  area: Area;
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
}

export const AreaCard = ({
  area,
  onEdit,
  onDelete,
  onToggleActive
}: AreaCardProps) => {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:shadow-lg ${
        area.is_active
          ? 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-blue-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-800'
          : 'border-dashed border-slate-300 bg-slate-50/80 dark:border-slate-600 dark:bg-slate-800/20'
      }`}
    >
      {/* Top row: icon + toggle */}
      <div className="mb-4 flex items-start justify-between">
        <div
          className={`text-4xl transition-all duration-300 ${
            area.is_active
              ? 'group-hover:scale-110'
              : 'opacity-50 grayscale'
          }`}
        >
          {area.icon}
        </div>

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
      </div>

      {/* Name + order */}
      <div className="mb-1 flex items-center gap-2">
        <h3
          className={`text-base font-bold ${
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
      </div>

      {/* Status badge */}
      <div className="mb-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            area.is_active
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              area.is_active ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
          {area.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      </div>

      {/* Description */}
      <p
        className={`mb-4 line-clamp-2 text-sm ${
          area.is_active
            ? 'text-slate-600 dark:text-slate-400'
            : 'text-slate-400 dark:text-slate-500'
        }`}
      >
        {area.description}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
        <div className="text-xs">
          <span className="font-medium text-slate-400 dark:text-slate-500">
            slug:{' '}
          </span>
          <span className="font-mono text-blue-500 dark:text-blue-400">
            {area.slug}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(area)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
            title="Edit area"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(area.id)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            title="Hapus area"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
