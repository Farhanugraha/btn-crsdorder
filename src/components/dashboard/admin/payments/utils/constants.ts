import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  CreditCard,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  DollarSign,
  MoreVertical
} from 'lucide-react';

export const PER_PAGE = 10;

export const STATUS_OPTIONS = [
  {
    value: 'completed',
    label: 'Dibayar',
    shortLabel: 'Verified',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-800 dark:text-emerald-300'
  },
  {
    value: 'rejected',
    label: 'Ditolak',
    shortLabel: 'Rejected',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300'
  },
  {
    value: 'all',
    label: 'Semua Status',
    shortLabel: 'All',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300'
  }
];

export const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Transfer Bank' },
  { value: 'credit_card', label: 'Kartu Kredit' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'qris', label: 'QRIS' },
  { value: 'all', label: 'Semua Metode' }
];

export const DATE_PRESETS = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'yesterday', label: 'Kemarin' },
  { value: 'thisWeek', label: 'Minggu Ini' },
  { value: 'thisMonth', label: 'Bulan Ini' },
  { value: 'all', label: 'Semua Waktu' }
];

export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    bank_transfer: 'Transfer Bank',
    credit_card: 'Kartu Kredit',
    e_wallet: 'E-Wallet',
    qris: 'QRIS'
  };
  return labels[method] || method;
};