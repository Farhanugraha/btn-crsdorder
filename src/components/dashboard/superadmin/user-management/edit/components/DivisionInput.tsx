'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const DIVISI_OPTIONS = [
  { value: 'CRSD 1', label: 'CRSD 1' },
  { value: 'CRSD 2', label: 'CRSD 2' },
  { value: 'LAINNYA', label: 'Lainnya' }
];

interface DivisionInputProps {
  value: string;
  isCustomDivisi: boolean;
  customDivisi: string;
  error?: string | null;
  disabled?: boolean;
  onDivisiSelect: (value: string) => void;
  onCustomDivisiChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const DivisionInput = ({
  value,
  isCustomDivisi,
  customDivisi,
  error,
  disabled = false,
  onDivisiSelect,
  onCustomDivisiChange
}: DivisionInputProps) => {
  // State lokal untuk tracking pilihan
  const [localSelected, setLocalSelected] = useState<string>(
    value === 'CRSD 1' || value === 'CRSD 2'
      ? value
      : isCustomDivisi
        ? 'LAINNYA'
        : ''
  );

  const [showInput, setShowInput] = useState<boolean>(isCustomDivisi);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = e.target.value;
    setLocalSelected(selected);

    if (selected === 'LAINNYA') {
      setShowInput(true);
      onDivisiSelect('LAINNYA');
    } else {
      setShowInput(false);
      onDivisiSelect(selected);
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="divisi"
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Divisi
      </label>

      <div className="space-y-3">
        {/* Dropdown */}
        <div className="relative">
          <select
            id="divisi"
            value={localSelected}
            onChange={handleSelectChange}
            disabled={disabled}
            className={`
              w-full appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:bg-slate-700 dark:text-white
              ${
                error
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            <option value="" disabled>
              Pilih Divisi
            </option>
            {DIVISI_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Input untuk "Lainnya" */}
        {showInput && (
          <div className="mt-2 space-y-1">
            <input
              type="text"
              value={customDivisi}
              onChange={onCustomDivisiChange}
              placeholder="Masukkan nama divisi"
              disabled={disabled}
              autoFocus
              className={`
                w-full rounded-lg border bg-white px-3 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-slate-700 dark:text-white
                ${
                  error
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-slate-300 dark:border-slate-600'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Masukkan nama divisi jika tidak ada dalam pilihan
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
