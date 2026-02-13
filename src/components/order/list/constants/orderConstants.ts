import { Clock, Hourglass, CheckCircle, X } from 'lucide-react';
import { StatusTab, SortBy, DateFilter, StatsPeriod } from '../types';

export const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'paid', label: 'Dibayar' },
  { value: 'canceled', label: 'Batal' }
];

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'price_high', label: 'Harga Tertinggi' },
  { value: 'price_low', label: 'Harga Terendah' }
];

export const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: 'all', label: 'Semua Waktu' },
  { value: 'today', label: 'Hari Ini' },
  { value: 'yesterday', label: 'Kemarin' },
  { value: 'week', label: '7 Hari Terakhir' },
  { value: 'month', label: '30 Hari Terakhir' }
];

export const STATS_PERIODS: { value: StatsPeriod; label: string }[] = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'year', label: 'Tahun Ini' },
  { value: 'all', label: 'Semua Waktu' }
];

export const getStatusConfig = (status: string, orderStatus: string) => {
  const configs = {
    pending: {
      bg: 'bg-yellow-100/80 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: Clock,
      label: 'Menunggu Pembayaran',
      progress: 25
    },
    paid:
      orderStatus === 'processing'
        ? {
            bg: 'bg-blue-100/80 dark:bg-blue-900/30',
            text: 'text-blue-800 dark:text-blue-300',
            icon: Hourglass,
            label: 'Diproses',
            progress: 50
          }
        : orderStatus === 'completed'
          ? {
              bg: 'bg-emerald-100/80 dark:bg-emerald-900/30',
              text: 'text-emerald-800 dark:text-emerald-300',
              icon: CheckCircle,
              label: 'Selesai',
              progress: 100
            }
          : {
              bg: 'bg-blue-100/80 dark:bg-blue-900/30',
              text: 'text-blue-800 dark:text-blue-300',
              icon: CheckCircle,
              label: 'Dibayar',
              progress: 75
            },
    canceled: {
      bg: 'bg-red-100/80 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      icon: X,
      label: 'Dibatalkan',
      progress: 0
    }
  };

  return configs[status as keyof typeof configs] || configs.pending;
};

export const ITEMS_PER_PAGE = 6;
export const MAX_PRICE = 1000000;
export const PRICE_STEP = 10000;