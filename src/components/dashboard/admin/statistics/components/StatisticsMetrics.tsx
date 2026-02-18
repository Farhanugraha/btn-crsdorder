'use client';

import type { StatisticsData } from '../types';
import { formatNumber } from '../utils/formatters';

interface StatisticsMetricsProps {
  statistics: StatisticsData;
  completionRate: number;
  processingRate: number;
  cancellationRate: number;
  formatters: {
    number: (value: number) => string;
  };
}

export const StatisticsMetrics = ({
  statistics,
  completionRate,
  processingRate,
  cancellationRate,
  formatters
}: StatisticsMetricsProps) => {
  const metrics = [
    {
      title: 'Tingkat Penyelesaian',
      value: completionRate.toFixed(1),
      suffix: '%',
      color: 'text-emerald-600',
      description: `${formatters.number(
        statistics.completedOrders
      )} dari ${formatters.number(statistics.totalOrders)} pesanan`
    },
    {
      title: 'Tingkat Pengerjaan',
      value: processingRate.toFixed(1),
      suffix: '%',
      color: 'text-amber-600',
      description: `${formatters.number(
        statistics.processingOrders
      )} dari ${formatters.number(statistics.totalOrders)} pesanan`
    },
    {
      title: 'Tingkat Pembatalan',
      value: cancellationRate.toFixed(1),
      suffix: '%',
      color: 'text-red-600',
      description: `${formatters.number(
        statistics.canceledOrders
      )} dari ${formatters.number(statistics.totalOrders)} pesanan`
    },
    {
      title: 'Pertumbuhan Pendapatan',
      value: statistics.revenueGrowth.toFixed(1),
      suffix: '%',
      color:
        statistics.revenueGrowth >= 0
          ? 'text-emerald-600'
          : 'text-red-600',
      prefix: statistics.revenueGrowth >= 0 ? '+' : '',
      description: 'Dibandingkan periode sebelumnya'
    }
  ];

  return (
    <div className="rounded-xl bg-white p-6 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Metrik Performa
        </h3>
        <span className="text-sm text-gray-500">
          Terakhir diperbarui:{' '}
          {new Date().toLocaleDateString('id-ID')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metric.title}
            </p>
            <p className={`mt-2 text-2xl font-bold ${metric.color}`}>
              {metric.prefix || ''}
              {metric.value}
              {metric.suffix}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
