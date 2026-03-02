'use client';

import { ShoppingCart, CreditCard, Calendar } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { formatCurrency } from '../utils/orderUtils';

interface OrdersStatsSectionProps {
  title: string;
  totalOrders: number;
  totalRevenue: number;
  weeklyRevenue: number;
  statusFilter: string;
  dateFilter?: string;
  // Hapus processingOrdersCount dan completedOrdersCount karena tidak digunakan dengan benar
  // Gunakan filtered stats yang sudah sesuai dengan filter
  filteredProcessingOrders?: number;
  filteredCompletedOrders?: number;
  filteredTotalOrders?: number;
  filteredTotalRevenue?: number;
}

export const OrdersStatsSection = ({
  title,
  totalOrders,
  totalRevenue,
  weeklyRevenue,
  statusFilter,
  dateFilter,
  filteredProcessingOrders,
  filteredCompletedOrders,
  filteredTotalOrders,
  filteredTotalRevenue
}: OrdersStatsSectionProps) => {
  // Tentukan nilai yang akan ditampilkan berdasarkan status filter
  const getDisplayTitle = () => {
    if (statusFilter === 'processing') {
      return 'Pesanan Menunggu';
    } else if (statusFilter === 'completed') {
      return 'Pesanan Selesai';
    } else {
      return 'Total Pesanan';
    }
  };

  const getDisplayValue = () => {
    // Jika filter status = 'processing', tampilkan jumlah processing yang sudah difilter
    if (statusFilter === 'processing') {
      return filteredProcessingOrders !== undefined
        ? filteredProcessingOrders
        : 0;
    }
    // Jika filter status = 'completed', tampilkan jumlah completed yang sudah difilter
    else if (statusFilter === 'completed') {
      return filteredCompletedOrders !== undefined
        ? filteredCompletedOrders
        : 0;
    }
    // Jika filter status = 'all', tampilkan total orders yang sudah difilter
    else if (filteredTotalOrders !== undefined) {
      return filteredTotalOrders;
    }
    // Fallback
    else {
      return totalOrders;
    }
  };

  const getRevenueValue = () => {
    // Untuk pendapatan, gunakan filteredTotalRevenue jika ada
    if (filteredTotalRevenue !== undefined) {
      return filteredTotalRevenue;
    } else {
      return totalRevenue;
    }
  };

  // Buat subtitle untuk menunjukkan filter aktif
  const getFilterSubtitle = () => {
    const filters = [];

    // Status filter
    if (statusFilter !== 'processing') {
      filters.push(
        statusFilter === 'completed' ? 'Selesai' : 'Semua status'
      );
    }

    // Date filter
    if (dateFilter && dateFilter !== 'today') {
      const dateLabels: Record<string, string> = {
        yesterday: 'Kemarin',
        week: 'Minggu ini',
        all: 'Semua waktu'
      };
      filters.push(dateLabels[dateFilter] || dateFilter);
    }

    return filters.length > 0 ? ` • ${filters.join(' • ')}` : '';
  };

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Ringkasan {title}
        </h2>
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          {title}
          {getFilterSubtitle()}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatsCard
          title={getDisplayTitle()}
          value={getDisplayValue()}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Total Pendapatan"
          value={formatCurrency(getRevenueValue())}
          icon={CreditCard}
          color="green"
        />
        <StatsCard
          title="Pendapatan/Minggu"
          value={formatCurrency(weeklyRevenue)}
          icon={CreditCard}
          color="purple"
        />
      </div>
    </div>
  );
};
