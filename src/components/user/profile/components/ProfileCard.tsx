'use client';

import { User, Shield, Calendar } from 'lucide-react';
import type { User as UserType } from '../types';
import { formatDate, getRoleBadgeColor } from '../utils/profileUtils';

interface ProfileCardProps {
  user: UserType;
  isAdmin: boolean;
}

export const ProfileCard = ({ user, isAdmin }: ProfileCardProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {user.name}
          </h2>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
              {user.role}
            </span>
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Status Akun
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(
                user.role,
                isAdmin
              )}`}
            >
              {isAdmin ? 'Administrator' : 'Pengguna'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ID Pengguna
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              #{user.id}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Bergabung
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDate(user.created_at)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Verifikasi Email
            </span>
            <span
              className={`text-sm font-medium ${
                user.email_verified_at
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {user.email_verified_at
                ? '✓ Terverifikasi'
                : 'Belum diverifikasi'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Terakhir update: {formatDate(user.updated_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
