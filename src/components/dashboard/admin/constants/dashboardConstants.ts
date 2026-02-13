import { FilterStatus } from '../types';

export const STATUS_FILTERS = [
  { value: 'processing' as FilterStatus, label: 'Menunggu Diproses' },
  { value: 'completed' as FilterStatus, label: 'Selesai' },
  { value: 'canceled' as FilterStatus, label: 'Dibatalkan' }
];

export const STATUS_COLORS = {
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  canceled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
};

export const STATUS_LABELS = {
  processing: 'Menunggu Diproses',
  completed: 'Selesai',
  canceled: 'Dibatalkan'
};

export const QUICK_ACTIONS = [
  {
    title: 'Semua Pesanan',
    description: 'Kelola semua pesanan',
    href: '/dashboard/orders',
    icon: 'Package'
  },
  {
    title: 'Verifikasi Pembayaran',
    description: 'Cek status pembayaran',
    href: '/dashboard/payments',
    icon: 'CreditCard'
  },
  {
    title: 'Laporan Bulanan',
    description: 'Export data laporan',
    href: '/dashboard/reports',
    icon: 'AlertCircle'
  }
];

export const STAT_COLORS = {
  blue: 'from-blue-500 to-blue-600',
  amber: 'from-amber-500 to-amber-600',
  emerald: 'from-emerald-500 to-emerald-600',
  green: 'from-green-500 to-green-600'
};

export const STAT_BG = {
  blue: 'bg-blue-50 dark:bg-blue-900/20',
  amber: 'bg-amber-50 dark:bg-amber-900/20',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
  green: 'bg-green-50 dark:bg-green-900/20'
};