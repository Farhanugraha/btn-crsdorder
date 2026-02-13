'use client';

import {
  ShoppingBag,
  Clock,
  CheckCircle,
  CreditCard,
  CalendarDays
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { formatPrice } from '../utils/orderUtils';
import { STATS_PERIODS } from '../constants/orderConstants';
import type { StatsPeriod } from '../types';
import { motion } from 'framer-motion';

interface OrderStatsProps {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    paidOrders: number;
    totalSpent: number;
  };
  statsPeriod: StatsPeriod;
  onStatsPeriodChange: (period: StatsPeriod) => void;
}

export const OrderStats = ({
  stats,
  statsPeriod,
  onStatsPeriodChange
}: OrderStatsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8"
    >
      <div className="rounded-xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <ShoppingBag className="h-5 w-5" />
              Statistik Pesanan
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Ringkasan aktivitas pemesanan Anda
            </p>
          </div>

          <Select
            value={statsPeriod}
            onValueChange={onStatsPeriodChange}
          >
            <SelectTrigger className="w-full border-slate-300 dark:border-slate-700 sm:w-[140px]">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATS_PERIODS.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                  Total Pesanan
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400 sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                  Menunggu Bayar
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {stats.pendingOrders}
                </p>
                {stats.pendingOrders > 0 && (
                  <p className="mt-0.5 text-xs text-yellow-600 dark:text-yellow-400">
                    {stats.pendingOrders} pesanan
                  </p>
                )}
              </div>
              <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                  Dibayar
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {stats.paidOrders}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                  Pengeluaran
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {formatPrice(stats.totalSpent).replace('Rp', 'Rp ')}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400 sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
