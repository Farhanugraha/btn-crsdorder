'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { formatPrice } from '../utils/orderUtils';

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onConfirm: (orderId: number, status: OrderStatus) => void;
  isUpdating: boolean;
}

export const UpdateStatusDialog = ({
  open,
  onOpenChange,
  order,
  onConfirm,
  isUpdating
}: UpdateStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>('processing');

  // Set default selected status when dialog opens
  useEffect(() => {
    if (open && order) {
      const statuses = getAvailableStatuses();
      if (statuses.length > 0) {
        setSelectedStatus(statuses[0].value);
      }
    }
  }, [open, order]);

  if (!order) return null;

  const getAvailableStatuses = (): {
    value: OrderStatus;
    label: string;
  }[] => {
    const statuses: { value: OrderStatus; label: string }[] = [];

    // Based on current order status
    if (order.status === 'pending') {
      statuses.push({
        value: 'paid',
        label: 'Konfirmasi Pembayaran'
      });
      statuses.push({ value: 'canceled', label: 'Batalkan Pesanan' });
    } else if (
      order.status === 'paid' &&
      order.order_status === 'processing'
    ) {
      statuses.push({
        value: 'completed',
        label: 'Selesaikan Pesanan'
      });
      statuses.push({ value: 'canceled', label: 'Batalkan Pesanan' });
    } else if (
      order.status === 'paid' &&
      order.order_status === 'completed'
    ) {
      statuses.push({ value: 'canceled', label: 'Batalkan Pesanan' });
    }

    return statuses;
  };

  const availableStatuses = getAvailableStatuses();

  const handleConfirm = () => {
    onConfirm(order.id, selectedStatus);
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'paid':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'canceled':
        return 'text-red-600 dark:text-red-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: OrderStatus): string => {
    switch (status) {
      case 'paid':
      case 'completed':
        return '✅';
      case 'canceled':
        return '❌';
      case 'processing':
        return '🔄';
      case 'pending':
        return '⏳';
      default:
        return '📦';
    }
  };

  const getWarningMessage = (): string => {
    if (selectedStatus === 'canceled') {
      return 'Pesanan yang dibatalkan tidak dapat dikembalikan ke status sebelumnya.';
    }
    if (selectedStatus === 'completed') {
      return 'Pastikan pesanan sudah selesai diproses dan diterima pelanggan.';
    }
    if (selectedStatus === 'paid') {
      return 'Pastikan bukti pembayaran sudah valid dan sesuai.';
    }
    if (selectedStatus === 'processing') {
      return 'Pesanan akan diproses oleh tim dapur.';
    }
    return '';
  };

  const getDialogTitle = (): string => {
    if (selectedStatus === 'paid') return 'Konfirmasi Pembayaran';
    if (selectedStatus === 'completed') return 'Selesaikan Pesanan';
    if (selectedStatus === 'canceled') return 'Batalkan Pesanan';
    if (selectedStatus === 'processing') return 'Proses Pesanan';
    return 'Update Status Pesanan';
  };

  if (availableStatuses.length === 0) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tidak Ada Aksi</AlertDialogTitle>
            <AlertDialogDescription>
              Pesanan ini tidak dapat diubah statusnya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tutup</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            {getDialogTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.order_code}
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Total: {formatPrice(order.total_price)}
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Pelanggan: {order.user.name}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Pilih Status Baru
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as OrderStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem
                      key={status.value}
                      value={status.value}
                    >
                      <span
                        className={`flex items-center gap-2 ${getStatusColor(
                          status.value
                        )}`}
                      >
                        <span>{getStatusIcon(status.value)}</span>
                        {status.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStatus && (
              <div className="rounded-lg border-l-4 border-l-yellow-600 bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                      {selectedStatus === 'paid' &&
                        'Konfirmasi Pembayaran'}
                      {selectedStatus === 'completed' &&
                        'Selesaikan Pesanan'}
                      {selectedStatus === 'canceled' &&
                        'Batalkan Pesanan'}
                      {selectedStatus === 'processing' &&
                        'Proses Pesanan'}
                    </p>
                    <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">
                      {getWarningMessage()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 sm:space-x-0">
          <AlertDialogCancel disabled={isUpdating}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isUpdating || !selectedStatus}
            className={`
              ${
                selectedStatus === 'canceled'
                  ? 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
                  : selectedStatus === 'paid' ||
                      selectedStatus === 'completed'
                    ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
              }
            `}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Konfirmasi'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
