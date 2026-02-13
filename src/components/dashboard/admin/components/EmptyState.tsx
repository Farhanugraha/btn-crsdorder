'use client';

import { CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title = 'Tidak ada pesanan',
  description = 'Semua pesanan telah diproses',
  icon
}: EmptyStateProps) => {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        {icon || (
          <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};
