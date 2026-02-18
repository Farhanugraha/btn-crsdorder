export const EXPORT_FORMATS = [
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' },
  { value: 'txt', label: 'TXT' }
];

export const MODULE_CONFIG = {
  crsd1: {
    name: 'CRSD 1',
    description: 'Dashboard khusus untuk divisi CRSD 1',
    icon: 'Building2',
    colors: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-200'
    }
  },
  crsd2: {
    name: 'CRSD 2',
    description: 'Dashboard khusus untuk divisi CRSD 2',
    icon: 'Building2',
    colors: {
      bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      text: 'text-emerald-600',
      border: 'border-emerald-200'
    }
  },
  general: {
    name: 'Dashboard Umum',
    description: 'Tampilan menyeluruh semua divisi yang Anda akses',
    icon: 'Globe',
    colors: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      text: 'text-purple-600',
      border: 'border-purple-200'
    }
  }
};

export const ROLE_BADGE_CONFIG = {
  superadmin: {
    bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
    icon: 'Shield',
    label: 'Super Admin'
  },
  admin: {
    bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    icon: 'Users',
    label: 'Admin'
  }
};