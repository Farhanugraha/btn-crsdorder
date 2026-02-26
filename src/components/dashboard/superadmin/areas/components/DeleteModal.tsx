'use client';

import { AlertCircle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({
  isOpen,
  onConfirm,
  onCancel
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl duration-300 animate-in fade-in zoom-in-95 dark:bg-slate-800">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Hapus Area
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </div>

          <p className="mb-6 text-sm text-slate-700 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus area ini? Semua data
            terkait akan dihapus secara permanen.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-red-500/25 transition-all hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/30"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
