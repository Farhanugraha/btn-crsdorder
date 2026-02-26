'use client';

import {
  ShieldAlert,
  ShieldCheck,
  Users,
  CheckCircle
} from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: 'user' | 'admin' | 'superadmin';
  onRoleChange: (role: 'user' | 'admin' | 'superadmin') => void;
}

export const RoleSelector = ({
  selectedRole,
  onRoleChange
}: RoleSelectorProps) => {
  const roles = [
    {
      value: 'superadmin',
      label: 'Super Admin',
      icon: ShieldAlert,
      iconColor: 'text-red-500',
      description: 'Akses penuh ke semua fitur sistem'
    },
    {
      value: 'admin',
      label: 'Administrator',
      icon: ShieldCheck,
      iconColor: 'text-orange-500',
      description: 'Akses terbatas sesuai data yang diizinkan'
    },
    {
      value: 'user',
      label: 'User',
      icon: Users,
      iconColor: 'text-blue-500',
      description: 'Akses terbatas untuk penggunaan biasa'
    }
  ];

  return (
    <div>
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
        <ShieldCheck className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
        Pilih Role
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.value;

          return (
            <div
              key={role.value}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
              onClick={() => onRoleChange(role.value as any)}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${role.iconColor}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize text-slate-900 dark:text-white">
                      {role.label}
                    </span>
                    {isSelected && (
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {role.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
