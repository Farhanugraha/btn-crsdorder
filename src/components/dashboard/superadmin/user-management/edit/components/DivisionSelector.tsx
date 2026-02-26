'use client';

import {
  CheckSquare,
  Square,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface DivisionSelectorProps {
  selectedDivisions: string[];
  onToggle: (code: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const divisionOptions = [
  {
    code: 'all',
    name: 'Semua Divisi',
    description: 'Admin dapat mengakses semua divisi CRSD',
    isAllOption: true
  },
  {
    code: 'crsd1',
    name: 'CRSD 1',
    description:
      'Consumer Collection, Recovery and Asset Sales Division 1'
  },
  {
    code: 'crsd2',
    name: 'CRSD 2',
    description:
      'Consumer Collection, Recovery and Asset Sales Division 2'
  }
];

export const DivisionSelector = ({
  selectedDivisions,
  onToggle,
  onSelectAll,
  onClearAll
}: DivisionSelectorProps) => {
  const getDisplayDivisions = () => {
    if (selectedDivisions.includes('all')) {
      return ['Semua Divisi (CRSD 1 & CRSD 2)'];
    }
    return selectedDivisions.map((code) => {
      const division = divisionOptions.find((d) => d.code === code);
      return division?.name || code;
    });
  };

  return (
    <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Akses Divisi CRSD *
            </label>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Pilih divisi yang dapat diakses oleh admin ini
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Pilih Semua
            </button>
            <span className="text-slate-300 dark:text-slate-600">
              |
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Hapus Semua
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {divisionOptions.map((division) => {
          const isSelected = selectedDivisions.includes(
            division.code
          );
          return (
            <div
              key={division.code}
              className={`relative flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all duration-200 ${
                isSelected
                  ? division.isAllOption
                    ? 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20'
                    : 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-700/50'
              }`}
              onClick={() => onToggle(division.code)}
            >
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                {isSelected ? (
                  <CheckSquare
                    className={`h-5 w-5 ${
                      division.isAllOption
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  />
                ) : (
                  <Square className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="block text-sm font-medium text-slate-900 dark:text-white">
                      {division.name}
                    </span>
                    {division.isAllOption && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                        <Globe className="h-3 w-3" />
                        Semua
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {division.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected divisions summary */}
      {selectedDivisions.length > 0 && (
        <div
          className={`mt-4 rounded-lg p-3 ${
            selectedDivisions.includes('all')
              ? 'bg-purple-50 dark:bg-purple-900/20'
              : 'bg-emerald-50 dark:bg-emerald-900/20'
          }`}
        >
          <div className="flex items-center">
            <CheckCircle
              className={`mr-2 h-4 w-4 ${
                selectedDivisions.includes('all')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                selectedDivisions.includes('all')
                  ? 'text-purple-800 dark:text-purple-300'
                  : 'text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {selectedDivisions.includes('all')
                ? 'Admin dapat mengakses Semua Divisi CRSD (CRSD 1 & CRSD 2)'
                : `Admin dapat mengakses: ${getDisplayDivisions().join(
                    ', '
                  )}`}
            </span>
          </div>
        </div>
      )}

      {selectedDivisions.length === 0 && (
        <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Pilih setidaknya satu divisi untuk admin
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
