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
import { useRouter } from 'next/navigation';

interface NoPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NoPaymentDialog = ({
  open,
  onOpenChange
}: NoPaymentDialogProps) => {
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400 sm:h-16 sm:w-16" />
          </div>
          <AlertDialogTitle className="text-center text-xl sm:text-2xl">
            Belum Ada Pembayaran
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400 sm:text-base">
            Anda tidak memiliki pesanan yang menunggu pembayaran saat
            ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-6 rounded-lg border-l-4 border-l-yellow-600 bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 sm:text-sm">
            💡 Silakan pesan makanan terlebih dahulu untuk melakukan
            pembayaran
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
          <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
            Tutup
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              router.push('/areas');
            }}
            className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Pesan Sekarang
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
