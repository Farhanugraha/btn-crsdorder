'use client';

import {
  FileText,
  CheckCircle,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { PaymentsStats as PaymentsStatsType } from '../types';
import {
  formatCurrency,
  formatFullCurrency
} from '../utils/paymentUtils';

interface PaymentsStatsProps {
  stats: PaymentsStatsType;
  dateDisplayText: string;
}

export const PaymentsStats = ({
  stats,
  dateDisplayText
}: PaymentsStatsProps) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:mb-8 lg:grid-cols-4 lg:gap-6">
      {/* ✅ Total Pembayaran - MENGIKUTI FILTER PERIODE */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 lg:text-sm">
              Total Pembayaran
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white lg:mt-2 lg:text-3xl">
              {stats.total}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 lg:text-xs">
              {dateDisplayText}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-2 dark:from-blue-900/30 dark:to-blue-800/30 lg:p-3">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 lg:h-6 lg:w-6" />
          </div>
        </div>
      </div>

      {/* ✅ Selesai - MENGIKUTI FILTER PERIODE */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 lg:text-sm">
              Selesai
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white lg:mt-2 lg:text-3xl">
              {stats.completed}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 lg:text-xs">
              {dateDisplayText}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 p-2 dark:from-emerald-900/30 dark:to-emerald-800/30 lg:p-3">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 lg:h-6 lg:w-6" />
          </div>
        </div>
      </div>

      {/* ✅ Total Pendapatan - MENGIKUTI FILTER PERIODE */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-3 shadow-sm dark:border-gray-700 dark:from-blue-900/20 dark:to-blue-800/20 lg:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300 lg:text-sm">
              Total Pendapatan
            </p>
            <p className="mt-1 text-lg font-bold text-blue-900 dark:text-blue-200 lg:mt-2 lg:text-2xl">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="mt-0.5 text-[10px] text-blue-700 dark:text-blue-400 lg:text-xs">
              {stats.completed} transaksi • {dateDisplayText}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2 lg:p-3">
            <TrendingUp className="h-4 w-4 text-white lg:h-6 lg:w-6" />
          </div>
        </div>
      </div>

      {/* ✅ Pendapatan Hari Ini - TETAP (untuk perbandingan) */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 lg:text-sm">
              Pendapatan Hari Ini
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white lg:mt-2 lg:text-2xl">
              {formatCurrency(stats.todayRevenue)}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 lg:text-xs">
              {stats.todayCount} transaksi
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 p-2 dark:from-purple-900/30 dark:to-purple-800/30 lg:p-3">
            <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400 lg:h-6 lg:w-6" />
          </div>
        </div>
        <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 lg:mt-4 lg:text-xs">
          {new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};
