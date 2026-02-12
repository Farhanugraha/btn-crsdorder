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

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoggingOut: boolean;
}

export const LogoutDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoggingOut
}: LogoutDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl sm:text-2xl">
            Konfirmasi Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400 sm:text-base">
            Apakah Anda yakin ingin logout? Anda akan perlu login
            kembali untuk mengakses akun Anda.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
          <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
