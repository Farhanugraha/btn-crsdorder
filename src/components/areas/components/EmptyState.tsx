'use client';

import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearSearch: () => void;
}

export const EmptyState = ({ onClearSearch }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-white/50 to-slate-50/50 p-8 text-center backdrop-blur-sm dark:border-slate-700 dark:from-slate-900/30 dark:to-slate-900/20"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <MapPin className="h-8 w-8 text-slate-400 dark:text-slate-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
        Area tidak ditemukan
      </h3>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        Coba kata kunci pencarian yang berbeda
      </p>
      <Button
        onClick={onClearSearch}
        variant="outline"
        className="rounded-full"
      >
        Tampilkan Semua Area
      </Button>
    </motion.div>
  );
};
