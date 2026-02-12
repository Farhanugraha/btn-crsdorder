import { RoleConfig } from '../types';

export const ROLE_CONFIG: Record<string, RoleConfig> = {
  superadmin: {
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50',
    label: 'Super Admin'
  },
  admin: {
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
    label: 'Administrator'
  },
  user: {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
    label: 'User'
  }
};

export const getRoleConfig = (role: string): RoleConfig => {
  return ROLE_CONFIG[role] || ROLE_CONFIG.user;
};