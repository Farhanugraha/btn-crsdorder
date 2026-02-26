'use client';

import {
  Database,
  ChevronDown,
  Check,
  X,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import type { DataTypeOption } from '../types';

interface DataAccessSelectorProps {
  selectedDataTypes: string[];
  dataTypeOptions: DataTypeOption[];
  showDropdown: boolean;
  loadingDataTypes: boolean;
  onToggle: (dataType: string) => void;
  onRemove: (dataType: string, e: React.MouseEvent) => void;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
  getSelectedDisplay: () => any[];
}

export const DataAccessSelector = ({
  selectedDataTypes,
  dataTypeOptions,
  showDropdown,
  loadingDataTypes,
  onToggle,
  onRemove,
  onToggleDropdown,
  onCloseDropdown,
  getSelectedDisplay
}: DataAccessSelectorProps) => {
  const selectedDisplay = getSelectedDisplay();

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
        <Database className="mr-2 inline h-5 w-5 text-orange-600 dark:text-orange-400" />
        Data Access Admin <span className="text-red-500">*</span>
      </h2>
      <div className="space-y-4">
        {/* Selected Data Types */}
        {selectedDataTypes.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Terpilih ({selectedDataTypes.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedDisplay.map((type) => (
                <span
                  key={type.value}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {type.label}
                  {type.value !== 'both' && (
                    <button
                      type="button"
                      onClick={(e) => onRemove(type.value, e)}
                      className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Data Type Selection */}
        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Pilih Data Access
          </label>
          <div
            className={`flex cursor-pointer items-center justify-between rounded-lg border bg-white p-3 dark:bg-slate-700 ${
              showDropdown
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-slate-300 dark:border-slate-600'
            }`}
            onClick={onToggleDropdown}
          >
            <div className="flex items-center gap-2">
              {loadingDataTypes ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Memuat data access...
                  </span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedDataTypes.length === 0
                      ? 'Pilih data yang bisa diakses...'
                      : selectedDataTypes.length === 2
                        ? 'All Access (CRSD 1 & 2)'
                        : `${selectedDataTypes.length} data terpilih`}
                  </span>
                </>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${
                showDropdown ? 'rotate-180' : ''
              }`}
            />
          </div>

          {showDropdown && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {/* All Access Option */}
              <div
                className={`flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  selectedDataTypes.length === 2
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
                onClick={() => onToggle('both')}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">
                      All Access
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Semua
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    Akses ke semua data (CRSD 1 dan 2)
                  </p>
                </div>
                {selectedDataTypes.length === 2 && (
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              {/* Individual Options */}
              {dataTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                    selectedDataTypes.includes(option.value)
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : ''
                  }`}
                  onClick={() => onToggle(option.value)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {option.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {option.description}
                    </p>
                  </div>
                  {selectedDataTypes.includes(option.value) && (
                    <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Information */}
        {selectedDataTypes.length > 0 && (
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/10">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-300">
                  Admin akan memiliki akses ke:
                </p>
                <ul className="mt-1 space-y-1 text-blue-700 dark:text-blue-400">
                  {selectedDataTypes.length === 2 ? (
                    <li>• Semua data (CRSD 1 dan 2)</li>
                  ) : (
                    selectedDataTypes.map((type) => {
                      const option = dataTypeOptions.find(
                        (opt) => opt.value === type
                      );
                      return (
                        option && (
                          <li key={type}>• {option.description}</li>
                        )
                      );
                    })
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
