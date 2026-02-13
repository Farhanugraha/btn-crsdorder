'use client';

import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onOrder: () => void;
}

export const EmptyState = ({
  hasFilters,
  onClearFilters,
  onOrder
}: EmptyStateProps) => {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-white/50 to-slate-50/50 p-8 text-center backdrop-blur-sm dark:border-slate-700 dark:from-slate-900/30 dark:to-slate-900/20"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Package className="h-8 w-8 text-slate-400 dark:text-slate-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
        Tidak ada pesanan
      </h3>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        {hasFilters
          ? 'Coba ubah filter pencarian Anda'
          : 'Mulai pesan makanan sekarang!'}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {hasFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="rounded-full"
          >
            Reset Filter
          </Button>
        )}
        <Button
          onClick={onOrder}
          className="rounded-full bg-emerald-600 px-6"
        >
          Pesan Sekarang
        </Button>
      </div>
    </motion.div>
  );
};
