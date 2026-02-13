'use client';

import { TrendingUp } from 'lucide-react';
import { StatCardProps } from '../types';
import {
  STAT_COLORS,
  STAT_BG
} from '../constants/dashboardConstants';

export const StatCard = ({
  title,
  value,
  icon,
  color,
  description,
  isLoading = false,
  showTrend = false,
  trendValue = 0
}: StatCardProps) => {
  const getTrendInfo = () => {
    if (trendValue === 0) {
      return {
        text: 'Belum ada transaksi',
        color: 'text-gray-500 dark:text-gray-400',
        icon: null
      };
    }
    return {
      text: 'Minggu ini',
      color: 'text-green-600 dark:text-green-400',
      icon: <TrendingUp className="h-3 w-3" />
    };
  };

  const trendInfo = getTrendInfo();

  if (isLoading) {
    return (
      <div
        className={`rounded-2xl border border-slate-200 p-6 transition-all hover:shadow-lg dark:border-gray-800 ${STAT_BG[color]}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-300 dark:bg-gray-700"></div>
          <div className="text-right">
            <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="h-4 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 p-6 transition-all hover:shadow-lg dark:border-gray-800 ${STAT_BG[color]}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${STAT_COLORS[color]} text-white shadow-md`}
        >
          {icon}
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        {showTrend && (
          <div
            className={`flex items-center gap-1 text-xs ${trendInfo.color}`}
          >
            {trendInfo.icon}
            <span>{trendInfo.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};
