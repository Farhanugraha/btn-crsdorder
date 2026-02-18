'use client';

import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  Users
} from 'lucide-react';
import type { StatisticsData, ExpandedSections } from '../types';

interface StatisticsStatusProps {
  statistics: StatisticsData;
  percentages: {
    completed: number;
    processing: number;
    canceled: number;
  };
  expandedSections: ExpandedSections;
  onToggleSection: (section: keyof ExpandedSections) => void;
  formatters: {
    number: (value: number) => string;
  };
}

export const StatisticsStatus = ({
  statistics,
  percentages,
  expandedSections,
  onToggleSection,
  formatters
}: StatisticsStatusProps) => {
  const statusItems = [
    {
      title: 'Sedang Diproses',
      value: statistics.processingOrders,
      percentage: percentages.processing,
      color: 'amber',
      icon: Clock,
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-600 dark:text-amber-400',
      progressColor: 'bg-amber-500'
    },
    {
      title: 'Selesai',
      value: statistics.completedOrders,
      percentage: percentages.completed,
      color: 'emerald',
      icon: CheckCircle,
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      progressColor: 'bg-emerald-500'
    },
    {
      title: 'Dibatalkan',
      value: statistics.canceledOrders,
      percentage: percentages.canceled,
      color: 'red',
      icon: XCircle,
      borderColor: 'border-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400',
      progressColor: 'bg-red-500'
    }
  ];

  return (
    <div className="mb-8">
      <div
        className="mb-4 flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 dark:bg-gray-800"
        onClick={() => onToggleSection('status')}
      >
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Status Pesanan
          </h3>
        </div>
        {expandedSections.status ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>

      {expandedSections.status && (
        <div className="grid gap-4 sm:grid-cols-3">
          {statusItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-xl border-l-4 ${item.borderColor} bg-white p-5 dark:bg-gray-800`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${item.bgColor}`}>
                    <Icon className={`h-5 w-5 ${item.textColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {item.title}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {formatters.number(item.value)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${item.progressColor} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {item.percentage.toFixed(1)}% dari total
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
