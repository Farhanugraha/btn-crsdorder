import { Search, X } from 'lucide-react';
import type { FilterRole } from '../types';

interface FilterPanelProps {
  searchTerm: string;
  filterRole: FilterRole;
  perPage: number;
  onSearchChange: (value: string) => void;
  onRoleChange: (role: FilterRole) => void;
  onPerPageChange: (value: number) => void;
  onReset: () => void;
  onClose: () => void;
}

export const FilterPanel = ({
  searchTerm,
  filterRole,
  perPage,
  onSearchChange,
  onRoleChange,
  onPerPageChange,
  onReset,
  onClose
}: FilterPanelProps) => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Filter Pencarian
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Cari Pengguna
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nama atau email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Role
          </label>
          <select
            value={filterRole}
            onChange={(e) =>
              onRoleChange(e.target.value as FilterRole)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">Semua Role</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Items per page */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Tampilkan per halaman
          </label>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value={5}>5 data</option>
            <option value={10}>10 data</option>
            <option value={15}>15 data</option>
            <option value={25}>25 data</option>
            <option value={50}>50 data</option>
          </select>
        </div>

        {/* Reset filters */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
};
