'use client';

import { User, ArrowLeft, Edit2 } from 'lucide-react';

interface ProfileHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  isEditing: boolean;
}

export const ProfileHeader = ({
  onBack,
  onEdit,
  isEditing
}: ProfileHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Profil Pengguna
              </h1>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                Kelola informasi akun Anda
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </button>

          {!isEditing && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
