import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { OrderStatus, OrderItem } from '../types';

export const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: Clock,
        label: 'Menunggu Pembayaran',
        shortLabel: 'Menunggu'
      };
    case 'paid':
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-800 dark:text-emerald-300',
        icon: CheckCircle,
        label: 'Dibayar',
        shortLabel: 'Dibayar'
      };
    case 'canceled':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        icon: AlertCircle,
        label: 'Dibatalkan',
        shortLabel: 'Dibatalkan'
      };
    default:
      return {
        bg: 'bg-slate-100 dark:bg-slate-700/30',
        text: 'text-slate-800 dark:text-slate-300',
        icon: AlertCircle,
        label: status,
        shortLabel: status
      };
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('id-ID');
};

export const calculateSubtotal = (items: OrderItem[]): number => {
  return items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
};

export const groupItemsByRestaurant = (items: OrderItem[]): Record<number, OrderItem[]> => {
  return items.reduce((acc, item) => {
    const restoId = item.menu?.restaurant_id || 0;
    if (!acc[restoId]) {
      acc[restoId] = [];
    }
    acc[restoId].push(item);
    return acc;
  }, {} as Record<number, OrderItem[]>);
};