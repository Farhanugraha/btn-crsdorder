'use client';

import { Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderCodeCardProps {
  orderCode: string;
  copiedText: string;
  onCopy: (text: string, label: string) => void;
}

export const OrderCodeCard = ({
  orderCode,
  copiedText,
  onCopy
}: OrderCodeCardProps) => {
  return (
    <div className="mb-8 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/10 sm:p-6">
      <p className="mb-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
        Nomor Pesanan Anda
      </p>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
          {orderCode}
        </p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onCopy(orderCode, 'Order Code')}
          className="h-8 w-8 flex-shrink-0"
        >
          {copiedText === 'Order Code' ? (
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
