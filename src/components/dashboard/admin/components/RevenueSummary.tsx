'use client';

import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { calculatePercentageChange } from '../utils/dashboardUtils';

interface RevenueSummaryProps {
  dashboardData: DashboardData;
  weeklyRevenue: number;
  lastWeekRevenue: number;
}

export const RevenueSummary = ({
  dashboardData,
  weeklyRevenue,
  lastWeekRevenue
}: RevenueSummaryProps) => {
  const percentageChange = calculatePercentageChange(
    weeklyRevenue,
    lastWeekRevenue
  );
  const isPositive = weeklyRevenue > lastWeekRevenue;
  const isNegative = weeklyRevenue < lastWeekRevenue;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6 shadow-lg dark:border-emerald-800 dark:from-emerald-900/20 dark:to-green-900/20">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Ringkasan Pendapatan
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analisis periode
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(dashboardData.payments.total_revenue)}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Total semua waktu
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Minggu ini
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(weeklyRevenue)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Minggu lalu
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(lastWeekRevenue)}
            </span>
          </div>

          {lastWeekRevenue > 0 && (
            <div
              className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-900/20'
                  : isNegative
                    ? 'bg-amber-50 dark:bg-amber-900/20'
                    : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : isNegative ? (
                  <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
                <span className="text-sm">
                  {isPositive
                    ? 'Naik'
                    : isNegative
                      ? 'Turun'
                      : 'Stabil'}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isNegative
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {percentageChange.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
