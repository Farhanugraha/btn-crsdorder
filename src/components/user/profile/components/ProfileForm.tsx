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
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Informasi Profil
      </h3>

      <div className="space-y-4">
        {/* Name Field */}
        <ProfileField
          label="Nama Lengkap"
          value={user.name}
          isEditing={isEditing}
          name="name"
          inputValue={formData.name}
          placeholder="Nama lengkap"
          disabled={isSaving}
          error={errors.name}
          onChange={onInputChange}
        />

        {/* Email Field (Read Only) */}
        <ProfileField
          label="Email"
          value={
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          }
          icon={<Mail className="h-4 w-4" />}
        />

        {/* Grid for Phone, Division, Work Unit */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Phone */}
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

          {/* Division */}
          <ProfileField
            label="Divisi"
            value={user.divisi || '-'}
            icon={<Briefcase className="h-4 w-4" />}
            isEditing={isEditing}
            name="divisi"
            inputValue={formData.divisi}
            placeholder="Divisi"
            disabled={isSaving}
            error={errors.divisi}
            onChange={onInputChange}
          />
        </div>

        {/* Work Unit - Full Width */}
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
