'use client';

import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface DeleteModalProps {
  show: boolean;
  isDeleting: boolean;
  userName: string;
  userEmail: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({
  show,
  isDeleting,
  userName,
  userEmail,
  onConfirm,
  onCancel
}: DeleteModalProps) => {
  if (!show) return null;

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-100 dark:border-red-800 dark:bg-red-900/30">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hapus Pengguna
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tindakan ini tidak dapat dibatalkan
            </p>
          </div>
        </div>

        <p className="mb-6 text-sm text-slate-700 dark:text-slate-300">
          Apakah Anda yakin ingin menghapus pengguna{' '}
          <span className="font-semibold">{userName}</span> (
          {userEmail})? Semua data terkait akan dihapus secara
          permanen.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Ya, Hapus'
            )}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
