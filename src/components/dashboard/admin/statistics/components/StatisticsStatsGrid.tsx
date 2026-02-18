'use client';

import {
  TrendingUp,
  CreditCard,
  ShoppingCart,
  Package
} from 'lucide-react';
import type { StatisticsData } from '../types';
import type { FormattersType } from '../hooks/useStatistics';

interface StatisticsStatsGridProps {
  statistics: StatisticsData;
  formatters: {
    currency: (value: number) => string;
    number: (value: number) => string;
    percentage: (value: number) => string;
  };
}

export const StatisticsStatsGrid = ({
  statistics,
  formatters
}: StatisticsStatsGridProps) => {
  const stats = [
    {
      title: 'Total Pendapatan',
      value: formatters.currency(statistics.totalRevenue),
      growth: statistics.revenueGrowth,
      icon: CreditCard,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      growthColor:
        statistics.revenueGrowth >= 0
          ? 'text-emerald-600'
          : 'text-red-600'
    },
    {
      title: 'Total Pesanan',
      value: formatters.number(statistics.totalOrders),
      growth: statistics.orderGrowth,
      icon: ShoppingCart,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      growthColor:
        statistics.orderGrowth >= 0
          ? 'text-emerald-600'
          : 'text-red-600'
    },
    {
      title: 'Pesanan Hari Ini',
      value: formatters.number(statistics.todayOrders),
      subtitle: `${formatters.currency(
        statistics.todayRevenue
      )} pendapatan`,
      icon: Package,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Rata-rata Nilai Pesanan',
      value: formatters.currency(statistics.averageOrderValue),
      subtitle: 'Per transaksi',
      icon: TrendingUp,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              {'growth' in stat && (
                <div className="mt-2 flex items-center gap-2">
                  <TrendingUp
                    className={`h-4 w-4 ${
                      stat.growth! >= 0
                        ? 'text-emerald-500'
                        : 'text-red-500'
                    }`}
                  />
                  <span className={`text-sm ${stat.growthColor}`}>
                    {formatters.percentage(stat.growth!)}
                  </span>
                </div>
              )}
              {'subtitle' in stat && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {stat.subtitle}
                </p>
              )}
            </div>
            <div className={`rounded-lg p-3 ${stat.iconBg}`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
