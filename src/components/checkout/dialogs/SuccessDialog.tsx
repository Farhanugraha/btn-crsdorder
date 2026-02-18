'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { CheckCircle } from 'lucide-react';

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderCode: string;
  onConfirm: () => void;
}

export const SuccessDialog = ({
  open,
  onOpenChange,
  orderCode,
  onConfirm
}: SuccessDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-12 w-12 text-emerald-600 sm:h-16 sm:w-16" />
          </div>
          <AlertDialogTitle className="text-center text-xl sm:text-2xl">
            Pembayaran Dikonfirmasi!
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-4 text-center">
            Bukti transfer Anda telah diterima. Admin akan
            memverifikasi dalam waktu singkat.
          </AlertDialogDescription>
          <div className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400">
            Nomor Pesanan:{' '}
            <span className="font-mono font-bold">{orderCode}</span>
          </div>
        </AlertDialogHeader>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Lihat Pesanan Saya
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
};
