'use client';

import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Info,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { TrendChart } from '../charts/TrendChart';
import { StatusPieChart } from '../charts/StatusPieChart';
import type { PieChartData, ExpandedSections } from '../types';
import type { FormattersType } from '../hooks/useStatistics';

interface StatisticsChartsProps {
  chartData: Array<{ date: string; orders: number; revenue: number }>;
  pieChartData: PieChartData;
  expandedSections: ExpandedSections;
  onToggleSection: (section: keyof ExpandedSections) => void;
  formatters: FormattersType;
}

export const StatisticsCharts = ({
  chartData,
  pieChartData,
  expandedSections,
  onToggleSection,
  formatters
}: StatisticsChartsProps) => {
  return (
    <div className="mb-8">
      <div
        className="mb-4 flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 dark:bg-gray-800"
        onClick={() => onToggleSection('grafik')}
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analisis Grafik
          </h3>
        </div>
        {expandedSections.grafik ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>

      {expandedSections.grafik && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grafik Trend */}
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Tren Pesanan & Pendapatan
                </h4>
              </div>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <TrendChart data={chartData} formatters={formatters} />
          </div>

          {/* Grafik Status */}
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Distribusi Status Pesanan
                </h4>
              </div>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <StatusPieChart
              data={pieChartData}
              formatters={formatters}
            />
          </div>
        </div>
      )}
    </div>
  );
};
