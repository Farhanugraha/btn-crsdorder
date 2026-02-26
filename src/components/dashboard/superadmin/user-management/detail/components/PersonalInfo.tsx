import {
  User,
  Hash,
  Phone,
  MailCheck,
  MailWarning
} from 'lucide-react';
import type { UserDetail } from '../types';

interface PersonalInfoProps {
  user: UserDetail;
  formatDate: (date: string | null) => string;
}

export const PersonalInfo = ({
  user,
  formatDate
}: PersonalInfoProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        Informasi Pribadi
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Hash className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <div className="min-w-0">
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              ID Pengguna
            </p>
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
              {user.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <div className="min-w-0">
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Telepon
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.phone || '-'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user.email_verified_at ? (
            <MailCheck className="h-4 w-4 flex-shrink-0 text-emerald-500" />
          ) : (
            <MailWarning className="h-4 w-4 flex-shrink-0 text-amber-500" />
          )}
          <div className="min-w-0">
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Status Email
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.email_verified_at
                ? 'Terverifikasi'
                : 'Belum Verifikasi'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
