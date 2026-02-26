import { Mail, CheckCircle, XCircle } from 'lucide-react';
import type { UserDetail } from '../types';

interface ProfileCardProps {
  user: UserDetail;
  getRoleColor: (role: string) => string;
  getRoleLabel: (role: string) => string;
}

export const ProfileCard = ({
  user,
  getRoleColor,
  getRoleLabel
}: ProfileCardProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(
                  user.role
                )}`}
              >
                {getRoleLabel(user.role)}
              </span>
              <span
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  user.email_verified_at
                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'border border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                }`}
              >
                {user.email_verified_at ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Aktif
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Pending
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
