'use client';

import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface OrderHeaderProps {
  onBack: () => void;
  onRefresh: () => void;
  onOrder: () => void;
  isRefreshing: boolean;
}

export const OrderHeader = ({
  onBack,
  onRefresh,
  onOrder,
  isRefreshing
}: OrderHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              Pesanan Saya
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola dan pantau semua pesanan Anda
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="rounded-full border-slate-300 dark:border-slate-700"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
          <Button
            onClick={onOrder}
            className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            size="sm"
          >
            <span className="hidden sm:inline">Pesan Lagi</span>
            <span className="sm:hidden">Pesan</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
