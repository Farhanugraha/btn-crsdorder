'use client';

import { ChevronDown } from 'lucide-react';
import { DIVISI_OPTIONS } from '../types';

interface DivisionInputProps {
  value: string;
  showCustomInput: boolean;
  customDivisi: string;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCustomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DivisionInput = ({
  value,
  showCustomInput,
  customDivisi,
  onSelectChange,
  onCustomChange
}: DivisionInputProps) => {
  // Tentukan nilai yang ditampilkan di dropdown
  const getSelectedValue = () => {
    if (value === 'CRSD 1' || value === 'CRSD 2') {
      return value;
    }
    if (showCustomInput) {
      return 'Other';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Divisi
        </label>
        <div className="relative">
          <select
            name="divisi"
            value={getSelectedValue()}
            onChange={onSelectChange}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="">Pilih Divisi</option>
            {DIVISI_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>

      {/* Custom Divisi Input - tampil jika showCustomInput true */}
      {showCustomInput && (
        <div className="animate-fade-in space-y-1">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nama Divisi Lainnya
          </label>
          <input
            type="text"
            value={customDivisi}
            onChange={onCustomChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            placeholder="Masukkan nama divisi"
            autoFocus
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Masukkan nama divisi jika tidak ada dalam pilihan
          </p>
        </div>
      )}
    </div>
  );
};
