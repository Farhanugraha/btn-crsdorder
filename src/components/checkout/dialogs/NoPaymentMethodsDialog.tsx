'use client';

import Link from 'next/link';
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

interface NoPaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NoPaymentMethodsDialog = ({
  open,
  onOpenChange
}: NoPaymentMethodsDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400 sm:h-16 sm:w-16" />
          </div>
          <AlertDialogTitle className="text-center text-xl sm:text-2xl">
            Metode Pembayaran Tidak Tersedia
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-4 text-center text-xs sm:text-base">
            Saat ini tidak ada metode pembayaran yang aktif. Silakan
            hubungi admin atau coba lagi nanti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-6 rounded-lg border-l-4 border-l-yellow-600 bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 sm:text-sm">
            ⚠️ Sistem pembayaran sedang tidak aktif
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <AlertDialogCancel asChild>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-center dark:border-slate-700"
            >
              Tutup
            </Link>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              window.location.href = '/order';
            }}
            className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Kembali ke Pesanan
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
