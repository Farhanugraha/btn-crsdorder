import { MODULE_CONFIG } from './constants';


export const getModuleDisplayName = (module: string): string => {
  switch (module) {
    case 'crsd1':
      return 'CRSD 1';
    case 'crsd2':
      return 'CRSD 2';
    case 'general':
      return 'Dashboard Umum';
    default:
      return module;
  }
};

export const getModuleDescription = (module: string): string => {
  switch (module) {
    case 'crsd1':
      return 'Dashboard khusus untuk divisi CRSD 1';
    case 'crsd2':
      return 'Dashboard khusus untuk divisi CRSD 2';
    case 'general':
      return 'Tampilan menyeluruh semua divisi (CRSD 1 & CRSD 2)';
    default:
      return 'Dashboard divisi khusus';
  }
};

export const getModuleColor = (module: string): { bg: string; text: string; border: string } => {
  switch (module) {
    case 'crsd1':
      return {
        bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-200'
      };
    case 'crsd2':
      return {
        bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        text: 'text-emerald-600',
        border: 'border-emerald-200'
      };
    case 'general':
      return {
        bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-200'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
        text: 'text-gray-600',
        border: 'border-gray-200'
      };
  }
};

export const getModuleIcon = (module: string): string => {
  switch (module) {
    case 'crsd1':
    case 'crsd2':
      return 'Building2';
    case 'general':
      return 'Globe';
    default:
      return 'PieChart';
  }
};

export const getAccessColor = (access: string): string => {
  switch (access) {
    case 'crsd1':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'crsd2':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getRoleBadge = (role: string) => {
  switch (role) {
    case 'superadmin':
      return {
        bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
        icon: 'Shield',
        label: 'Super Admin'
      };
    case 'admin':
      return {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        icon: 'Users',
        label: 'Admin'
      };
    default:
      return null;
  }
};