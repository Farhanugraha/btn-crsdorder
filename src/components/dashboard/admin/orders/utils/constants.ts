import { 
  Clock, 
  CheckSquare, 
  Filter, 
  Calendar, 
  Building2, 
  ShoppingCart, 
  CreditCard, 
  Hash, 
  User, 
  Store, 
  MapPin, 
  Utensils, 
  Eye, 
  ChevronUp, 
  ChevronDown, 
  MoreVertical,
  Copy, 
  FileText, 
  RefreshCw, 
  Download, 
  X, 
  Search, 
  AlertCircle, 
  Package, 
  PackageOpen, 
  CheckCircle,
  Layers, 
  ChefHat, 
  Tag, 
  BadgeCheck, 
  Sparkles, 
  Truck,
  Phone, 
  CalendarDays, 
  Clock as ClockIcon
} from 'lucide-react';

export const STATUS_OPTIONS = [
  { value: 'processing', label: 'Menunggu', icon: Clock },
  { value: 'completed', label: 'Selesai', icon: CheckSquare },
  { value: 'all', label: 'Semua', icon: Filter }
] as const;

export const DATE_OPTIONS = [
  { value: 'today', label: 'Hari Ini', icon: Calendar },
  { value: 'yesterday', label: 'Kemarin', icon: Calendar },
  { value: 'thisWeek', label: 'Minggu Ini', icon: Calendar },
  { value: 'all', label: 'Semua', icon: Calendar }
] as const;

export const CRSD_OPTIONS = [
  { value: 'all', label: 'Semua Divisi', icon: Building2 },
  { value: 'crsd1', label: 'CRSD 1', icon: Building2 },
  { value: 'crsd2', label: 'CRSD 2', icon: Building2 }
] as const;

export const STATUS_STYLES = {
  order: {
    processing: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md',
      text: 'text-white',
      icon: Clock,
      label: 'Menunggu'
    },
    completed: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md',
      text: 'text-white',
      icon: CheckSquare,
      label: 'Selesai'
    }
  },
  payment: {
    pending: {
      bg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md',
      text: 'text-white',
      icon: Clock,
      label: 'Pending'
    },
    paid: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md',
      text: 'text-white',
      icon: CheckCircle,
      label: 'Dibayar'
    }
  }
} as const;

export const CRSD_STYLES = {
  crsd1: {
    bg: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md',
    text: 'text-white',
    icon: Building2,
    label: 'CRSD 1'
  },
  crsd2: {
    bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md',
    text: 'text-white',
    icon: Building2,
    label: 'CRSD 2'
  }
} as const;

export const STATS_CARD_COLORS = {
  blue: {
    icon: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30'
  },
  green: {
    icon: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30'
  },
  purple: {
    icon: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30'
  },
  amber: {
    icon: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30'
  }
} as const;

export const PER_PAGE = 10;