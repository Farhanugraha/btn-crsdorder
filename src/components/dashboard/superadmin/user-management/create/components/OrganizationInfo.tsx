'use client';

import { Building } from 'lucide-react';
import type { CreateUserData } from '../types';
import { DivisionInput } from './DivisionInput';

interface OrganizationInfoProps {
  formData: CreateUserData;
  divisionState: {
    showCustomInput: boolean;
    customDivisi: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDivisiSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCustomDivisiChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const OrganizationInfo = ({
  formData,
  divisionState,
  onInputChange,
  onDivisiSelect,
  onCustomDivisiChange
}: OrganizationInfoProps) => {
  return (
    <div>
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
        <Building className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
        Informasi Organisasi
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Column - Divisi Section */}
        <div className="space-y-4">
          <DivisionInput
            value={formData.divisi}
            showCustomInput={divisionState.showCustomInput}
            customDivisi={divisionState.customDivisi}
            onSelectChange={onDivisiSelect}
            onCustomChange={onCustomDivisiChange}
          />
        </div>

        {/* Right Column - Unit Kerja */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Unit Kerja
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Building className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="unit_kerja"
              value={formData.unit_kerja}
              onChange={onInputChange}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="Contoh: Jakarta, Bandung"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
