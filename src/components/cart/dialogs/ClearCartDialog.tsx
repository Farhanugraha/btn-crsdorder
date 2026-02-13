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

interface ClearCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isUpdating: boolean;
}

export const ClearCartDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isUpdating
}: ClearCartDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Kosongkan Keranjang?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-slate-600 dark:text-slate-400">
            Semua item akan dihapus dari keranjang. Tindakan ini tidak
            dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-6 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            ⚠️ Peringatan: Semua pesanan akan dihapus permanen
          </p>
        </div>
        <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
          Batal
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={isUpdating}
          className="rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          {isUpdating ? '⏳ Menghapus...' : '🗑️ Hapus Semua'}
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
};
