'use client';

import type { UserDetail } from '../types';

interface UserStatusCardProps {
  user: UserDetail;
  selectedDivisions: string[];
  formatDate: (date: string | null) => string;
  getRoleLabel: (role: string) => string;
}

const divisionOptions = [
  { code: 'crsd1', name: 'CRSD 1' },
  { code: 'crsd2', name: 'CRSD 2' }
];

export const UserStatusCard = ({
  user,
  selectedDivisions,
  formatDate,
  getRoleLabel
}: UserStatusCardProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Status Pengguna
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Status Akun
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              user.email_verified_at
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
            }`}
          >
            {user.email_verified_at ? 'Aktif' : 'Pending'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            ID Pengguna
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {user.id}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Bergabung
          </span>
          <span className="text-sm text-slate-900 dark:text-white">
            {formatDate(user.created_at)}
          </span>
        </div>

        {/* Show divisi access if admin */}
        {user.role === 'admin' && (
          <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Akses Divisi CRSD
              </span>
              <span
                className={`text-sm font-medium ${
                  selectedDivisions.includes('all')
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {selectedDivisions.includes('all')
                  ? 'Semua Divisi'
                  : `${selectedDivisions.length} divisi`}
              </span>
            </div>
            {selectedDivisions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedDivisions.includes('all') ? (
                  <span className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 text-xs font-medium text-purple-800 dark:from-purple-900/40 dark:to-blue-900/40 dark:text-purple-300">
                    Semua Divisi CRSD
                  </span>
                ) : (
                  selectedDivisions
                    .map((code) => {
                      const division = divisionOptions.find(
                        (d) => d.code === code
                      );
                      if (!division) return null;
                      return (
                        <span
                          key={code}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {division.name}
                        </span>
                      );
                    })
                    .filter(Boolean)
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
