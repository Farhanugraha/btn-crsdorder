'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';

interface PendingPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  pendingOrderId: number | null;
}

export const PendingPaymentDialog = ({
  open,
  onOpenChange,
  onContinue,
  pendingOrderId
}: PendingPaymentDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-400 sm:h-16 sm:w-16" />
          </div>
          <AlertDialogTitle className="text-center text-xl sm:text-2xl">
            Pembayaran Belum Selesai
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400 sm:text-base">
            Anda masih memiliki pesanan dengan status pembayaran
            menunggu. Silakan selesaikan pembayaran terlebih dahulu
            sebelum membuat pesanan baru.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-6 rounded-lg border-l-4 border-l-amber-600 bg-amber-50 p-4 dark:bg-amber-900/20">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 sm:text-sm">
            ⏳ Tunda pemesanan baru dan selesaikan pembayaran yang
            tertunda terlebih dahulu
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
          <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onContinue}
            className="rounded-lg bg-amber-600 text-white hover:bg-amber-700"
          >
            Selesaikan Pembayaran
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
