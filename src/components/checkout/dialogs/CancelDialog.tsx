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

interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderCode: string;
  isCancelling: boolean;
  onConfirm: () => void;
}

export const CancelDialog = ({
  open,
  onOpenChange,
  orderCode,
  isCancelling,
  onConfirm
}: CancelDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Batalkan Pesanan?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-slate-600 dark:text-slate-400">
            Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan
            ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-6 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            ⚠️ Pesanan {orderCode} akan dibatalkan
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
          <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
            Tidak, Lanjutkan
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isCancelling}
            className="rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {isCancelling ? '⏳ Membatalkan...' : '🗑️ Ya, Batalkan'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
