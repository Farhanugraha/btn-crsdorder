'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '../types';

interface ActionButtonsProps {
  status: OrderStatus;
  orderId: number;
  onCheckout: () => void;
  onCancel: () => void;
  onBack: () => void;
}

export const ActionButtons = ({
  status,
  orderId,
  onCheckout,
  onCancel,
  onBack
}: ActionButtonsProps) => {
  if (status === 'pending') {
    return (
      <div className="space-y-3">
        <Button
          onClick={onCheckout}
          className="w-full bg-emerald-600 py-2 text-sm font-semibold hover:bg-emerald-700 sm:py-3 sm:text-base"
        >
          Lanjut ke Pembayaran
        </Button>
        <Button
          variant="destructive"
          onClick={onCancel}
          className="w-full text-sm sm:text-base"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Batalkan Pesanan
        </Button>
      </div>
    );
  }

  if (status === 'paid' || status === 'canceled') {
    return (
      <Button
        onClick={onBack}
        className="w-full bg-blue-600 py-2 text-sm font-semibold hover:bg-blue-700 sm:py-3 sm:text-base"
      >
        Kembali ke Daftar Pesanan
      </Button>
    );
  }

  return null;
};
