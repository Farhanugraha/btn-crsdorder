'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import type { OrderStatus } from '../types';

interface OrderDetailHeaderProps {
  onBack: () => void;
  status: OrderStatus;
}

export const OrderDetailHeader = ({
  onBack,
  status
}: OrderDetailHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Detail Pesanan
        </h1>
      </div>
      <StatusBadge status={status} />
    </div>
  );
};
