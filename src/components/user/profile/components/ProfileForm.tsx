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

// Konstanta untuk opsi divisi
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
  // State untuk mengecek apakah divisi adalah "Lainnya"
  const [isOtherDivisi, setIsOtherDivisi] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState('');

  // Inisialisasi state berdasarkan formData.divisi
  useEffect(() => {
    if (formData.divisi) {
      const isCrsd =
        formData.divisi === 'CRSD 1' || formData.divisi === 'CRSD 2';
      setIsOtherDivisi(!isCrsd);
      if (isCrsd) {
        setSelectedDivisi(formData.divisi);
      } else {
        setSelectedDivisi('LAINNYA');
      }
    } else {
      setSelectedDivisi('');
      setIsOtherDivisi(false);
    }
  }, [formData.divisi]);

  // Handler untuk perubahan dropdown
  const handleDivisiChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    if (value === 'LAINNYA') {
      setIsOtherDivisi(true);
      setSelectedDivisi('LAINNYA');
      onInputChange({
        target: { name: 'divisi', value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setIsOtherDivisi(false);
      setSelectedDivisi(value);
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
        {/* Nama Lengkap */}
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

        {/* Email */}
        <ProfileField
          label="Email"
          value={user.email}
          icon={<Mail className="h-4 w-4" />}
          isEditing={false}
        />

        {/* Grid 2 kolom */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Nomor Telepon */}
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

          {/* Divisi - menggunakan children untuk custom render */}
          {isEditing ? (
            <ProfileField
              label="Divisi"
              value=""
              icon={<Briefcase className="h-4 w-4" />}
              isEditing={true}
              error={errors.divisi}
            >
              <div className="space-y-2">
                <select
                  value={selectedDivisi}
                  onChange={handleDivisiChange}
                  disabled={isSaving}
                  className={`
                    w-full appearance-none rounded-lg border bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                    bg-[length:1.25rem] bg-[position:right_0.5rem_center]
                    bg-no-repeat py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    dark:bg-gray-700 dark:bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23aaa%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                    dark:text-white
                    ${
                      errors.divisi
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }
                    ${isSaving ? 'cursor-not-allowed opacity-50' : ''}
                    pl-10
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

                {isOtherDivisi && (
                  <input
                    type="text"
                    name="divisi"
                    value={formData.divisi || ''}
                    onChange={onInputChange}
                    placeholder="Masukkan nama divisi"
                    disabled={isSaving}
                    className={`
                      w-full rounded-lg border bg-white py-2 text-sm
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
                      pl-10
                    `}
                  />
                )}
              </div>
            </ProfileField>
          ) : (
            <ProfileField
              label="Divisi"
              value={user.divisi || '-'}
              icon={<Briefcase className="h-4 w-4" />}
              isEditing={false}
            />
          )}
        </div>

        {/* Unit Kerja */}
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

      {/* Action Buttons */}
      {isEditing && (
        <div className="mt-6 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <X className="h-4 w-4" />
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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
