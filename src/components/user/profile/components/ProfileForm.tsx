'use client';

import {
  Mail,
  Phone,
  Briefcase,
  Building2,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { ProfileField } from './ProfileField';
import type { User, ProfileFormData, ProfileErrors } from '../types';
import { useState, useEffect } from 'react';

const DIVISI_OPTIONS = [
  { value: 'CRSD 1', label: 'CRSD 1' },
  { value: 'CRSD 2', label: 'CRSD 2' },
  { value: 'LAINNYA', label: 'Lainnya' }
];

interface ProfileFormProps {
  user: User;
  formData: ProfileFormData;
  errors: ProfileErrors;
  isEditing: boolean;
  isSaving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileForm = ({
  user,
  formData,
  errors,
  isEditing,
  isSaving,
  onInputChange,
  onSave,
  onCancel
}: ProfileFormProps) => {
  const [selectedDivisi, setSelectedDivisi] = useState('');

  useEffect(() => {
    if (formData.divisi) {
      const isCrsd =
        formData.divisi === 'CRSD 1' || formData.divisi === 'CRSD 2';
      setSelectedDivisi(isCrsd ? formData.divisi : 'LAINNYA');
    }
  }, []);

  const handleDivisiChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    setSelectedDivisi(value);

    if (value === 'LAINNYA') {
      onInputChange({
        target: { name: 'divisi', value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      onInputChange({
        target: { name: 'divisi', value: value }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Informasi Profil
      </h3>

      <div className="space-y-4">
        <ProfileField
          label="Nama Lengkap"
          value={user.name}
          icon={<Mail className="h-4 w-4" />}
          isEditing={isEditing}
          name="name"
          inputValue={formData.name}
          placeholder="Nama lengkap"
          disabled={isSaving}
          error={errors.name}
          onChange={onInputChange}
        />

        <ProfileField
          label="Email"
          value={user.email}
          icon={<Mail className="h-4 w-4" />}
          isEditing={false}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProfileField
            label="Nomor Telepon"
            value={user.phone || '-'}
            icon={<Phone className="h-4 w-4" />}
            isEditing={isEditing}
            name="phone"
            inputValue={formData.phone}
            placeholder="08xxxxxxxxxx"
            disabled={isSaving}
            error={errors.phone}
            onChange={onInputChange}
            type="tel"
          />

          {isEditing ? (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Divisi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <select
                  value={selectedDivisi}
                  onChange={handleDivisiChange}
                  disabled={isSaving}
                  className={`
                    w-full appearance-none rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    dark:bg-gray-700 dark:text-white
                    ${
                      errors.divisi
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }
                    ${isSaving ? 'cursor-not-allowed opacity-50' : ''}
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {selectedDivisi === 'LAINNYA' && (
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="divisi"
                    value={formData.divisi || ''}
                    onChange={onInputChange}
                    placeholder="Masukkan nama divisi"
                    disabled={isSaving}
                    className={`
                      w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      dark:bg-gray-700 dark:text-white
                      ${
                        errors.divisi
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }
                      ${
                        isSaving
                          ? 'cursor-not-allowed opacity-50'
                          : ''
                      }
                    `}
                    autoFocus
                  />
                </div>
              )}

              {errors.divisi && (
                <p className="text-xs text-red-500">
                  {errors.divisi[0]}
                </p>
              )}
            </div>
          ) : (
            <ProfileField
              label="Divisi"
              value={user.divisi || '-'}
              icon={<Briefcase className="h-4 w-4" />}
              isEditing={false}
            />
          )}
        </div>

        <ProfileField
          label="Unit Kerja"
          value={user.unit_kerja || '-'}
          icon={<Building2 className="h-4 w-4" />}
          isEditing={isEditing}
          name="unit_kerja"
          inputValue={formData.unit_kerja}
          placeholder="Unit Kerja"
          disabled={isSaving}
          error={errors.unit_kerja}
          onChange={onInputChange}
        />
      </div>

      {isEditing && (
        <div className="mt-6 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <X className="h-4 w-4" />
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
