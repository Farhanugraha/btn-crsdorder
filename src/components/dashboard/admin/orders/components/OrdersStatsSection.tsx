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
}

export const OrdersStatsSection = ({
  title,
  totalOrders,
  totalRevenue,
  weeklyRevenue,
  statusFilter
}: OrdersStatsSectionProps) => {
  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Ringkasan {title}
        </h2>
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          {title}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatsCard
          title={
            statusFilter === 'processing'
              ? 'Pesanan Menunggu'
              : statusFilter === 'completed'
                ? 'Pesanan Selesai'
                : 'Total Pesanan'
          }
          value={totalOrders}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Total Pendapatan"
          value={formatCurrency(totalRevenue)}
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
