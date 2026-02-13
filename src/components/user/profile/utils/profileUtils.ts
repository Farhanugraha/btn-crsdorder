import { User, ProfileFormData } from '../types';

export const getHomeRoute = (user: User | null): string => {
  if (!user) return '/';

  switch (user.role) {
    case 'superadmin':
      return '/dashboard/superadmin/';
    case 'admin':
      return '/dashboard/admin/';
    default:
      return '/';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getRoleBadgeColor = (role: string, isAdmin: boolean): string => {
  return isAdmin
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
};

export const getInitialFormData = (user: User | null): ProfileFormData => ({
  name: user?.name || '',
  phone: user?.phone || '',
  divisi: user?.divisi || '',
  unit_kerja: user?.unit_kerja || ''
});