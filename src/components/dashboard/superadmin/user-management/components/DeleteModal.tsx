import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import type { DeleteModalProps } from '../types';

export const DeleteModal = ({
  isOpen,
  isProcessing,
  onConfirm,
  onCancel
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onCancel();
        }
      }}
    >
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-500" />
        <div className="p-6">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100 dark:bg-red-900/30 dark:ring-red-800/40">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Hapus Pengguna?
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          <p className="rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
            Semua data terkait pengguna ini akan dihapus secara
            permanen dari sistem dan tidak dapat dipulihkan.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-2.5 text-sm font-bold text-white shadow-md shadow-red-200/60 transition-all hover:from-red-600 hover:to-rose-700 hover:shadow-lg active:scale-[.98] disabled:opacity-50 dark:shadow-red-950/30"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />{' '}
                  Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" /> Ya, Hapus
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
