'use client';

import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
import { StatCard } from './StatCard';
import { DashboardData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { getCurrentWeekRange } from '../utils/dashboardUtils';

interface StatsGridProps {
  dashboardData: DashboardData | null;
  weeklyRevenue: number;
  isCalculatingRevenue: boolean;
  isLoading?: boolean;
}

export const StatsGrid = ({
  dashboardData,
  weeklyRevenue,
  isCalculatingRevenue,
  isLoading = false
}: StatsGridProps) => {
  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              <div className="text-right">
                <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Pesanan"
          value="0"
          icon={<ShoppingCart className="h-6 w-6" />}
          color="blue"
          description="Memuat data..."
        />
        <StatCard
          title="Menunggu Diproses"
          value="0"
          icon={<Clock className="h-6 w-6" />}
          color="amber"
          description="Memuat data..."
        />
        <StatCard
          title="Selesai"
          value="0"
          icon={<CheckCircle2 className="h-6 w-6" />}
          color="emerald"
          description="Memuat data..."
        />
        <StatCard
          title="Pendapatan Minggu Ini"
          value="Rp 0"
          icon={<CreditCard className="h-6 w-6" />}
          color="green"
          description="Memuat data..."
        />
      </div>
    );
  }

  const today = new Date();
  const todayFormatted = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatCard
        title="Total Pesanan Hari Ini"
        value={dashboardData.orders?.today ?? 0}
        icon={<ShoppingCart className="h-6 w-6" />}
        color="blue"
        description={todayFormatted}
      />

      <StatCard
        title="Menunggu Diproses"
        value={dashboardData.orders?.processing ?? 0}
        icon={<Clock className="h-6 w-6" />}
        color="amber"
        description="Perlu tindakan segera"
      />

      <StatCard
        title="Selesai Hari Ini"
        value={dashboardData.orders?.completedToday ?? 0}
        icon={<CheckCircle2 className="h-6 w-6" />}
        color="emerald"
        description={todayFormatted}
      />

      <StatCard
        title="Pendapatan Minggu Ini"
        value={formatCurrency(weeklyRevenue)}
        icon={<CreditCard className="h-6 w-6" />}
        color="green"
        description={getCurrentWeekRange()}
        isLoading={isCalculatingRevenue}
        showTrend={true}
        trendValue={weeklyRevenue}
      />
    </div>
  );
};
