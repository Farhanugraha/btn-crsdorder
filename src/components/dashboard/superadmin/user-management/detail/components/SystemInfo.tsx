import { Clock } from 'lucide-react';
import type { UserDetail } from '../types';

interface SystemInfoProps {
  user: UserDetail;
  formatDate: (date: string | null) => string;
}

export const SystemInfo = ({ user, formatDate }: SystemInfoProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        Informasi Sistem
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Tanggal Bergabung
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {formatDate(user.created_at)}
            </p>
          </div>
          {user.email_verified_at && (
            <div>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                Tanggal Verifikasi
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatDate(user.email_verified_at)}
              </p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Terakhir Diperbarui
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {formatDate(user.updated_at)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Status Akun
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.email_verified_at ? 'Aktif' : 'Menunggu Aktivasi'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
