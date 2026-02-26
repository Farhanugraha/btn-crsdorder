import {
  Briefcase,
  Shield,
  Building,
  Shield as ShieldIcon
} from 'lucide-react';
import type { UserDetail } from '../types';

interface OrganizationInfoProps {
  user: UserDetail;
  getRoleLabel: (role: string) => string;
}

export const OrganizationInfo = ({
  user,
  getRoleLabel
}: OrganizationInfoProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        Informasi Organisasi
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <div className="min-w-0">
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Divisi
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.divisi || '-'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Building className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <div className="min-w-0">
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Unit Kerja
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.unit_kerja || '-'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <div className="min-w-0">
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Hak Akses
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {getRoleLabel(user.role)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
