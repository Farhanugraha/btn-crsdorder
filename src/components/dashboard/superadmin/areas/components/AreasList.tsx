'use client';

import { CheckCircle2, Plus } from 'lucide-react';
import { AreaCard } from './AreaCard';
import { AreaListItem } from './AreaListItem';
import type { Area, ViewMode } from '../types';

interface AreasListProps {
  areas: Area[];
  isLoading: boolean;
  viewMode: ViewMode;
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  onAddFirst: () => void;
}

// Skeleton Components
const GridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="h-12 w-12 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-6 w-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="mb-2 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mb-4 space-y-2">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AreasList = ({
  areas,
  isLoading,
  viewMode,
  onEdit,
  onDelete,
  onToggleActive,
  onAddFirst
}: AreasListProps) => {
  if (isLoading) {
    return viewMode === 'grid' ? <GridSkeleton /> : <ListSkeleton />;
  }

  if (areas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6 rounded-full bg-emerald-50 p-6 dark:bg-emerald-900/10">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Belum ada area
        </h3>
        <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
          Mulai dengan menambahkan area pertama Anda untuk mengelola
          lokasi bisnis
        </p>
        <button
          onClick={onAddFirst}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" />
          Tambah Area Pertama
        </button>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {areas.map((area) => (
        <AreaListItem
          key={area.id}
          area={area}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};
