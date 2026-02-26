'use client';

import { Building } from 'lucide-react';
import type { UpdateUserData } from '../types';

interface OrganizationInfoProps {
  formData: UpdateUserData;
  updating: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OrganizationInfo = ({
  formData,
  updating,
  onInputChange
}: OrganizationInfoProps) => {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Informasi Organisasi
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Informasi unit kerja (selain CRSD)
        </p>
      </div>

      <div className="space-y-4 p-5">
        {/* Unit Kerja Field */}
        <div>
          <label
            htmlFor="unit_kerja"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Unit Kerja
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Building className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="unit_kerja"
              name="unit_kerja"
              value={formData.unit_kerja}
              onChange={onInputChange}
              disabled={updating}
              className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Masukkan unit kerja"
            />
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Contoh: Jakarta, Surabaya, Kantor Pusat, dll.
          </p>
        </div>
      </div>
    </div>
  );
};
