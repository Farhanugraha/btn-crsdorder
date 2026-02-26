import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import type { DeleteModalProps } from '../types';
import { useEffect, useState } from 'react';

export const DeleteModal = ({
  isOpen,
  isProcessing,
  onConfirm,
  onCancel
}: DeleteModalProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen
          ? 'bg-black/40 backdrop-blur-sm'
          : 'pointer-events-none bg-black/0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onCancel();
        }
      }}
    >
      <div
        className={`w-full max-w-sm transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 dark:bg-slate-800 sm:max-w-md ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Red gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-500" />

        <div className="p-6">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100 dark:bg-red-900/30 dark:ring-red-800/40">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Hapus Pengguna?
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <p className="mb-6 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
            Semua data terkait pengguna ini akan dihapus secara
            permanen dari sistem dan tidak dapat dipulihkan.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:from-red-600 hover:to-rose-700 hover:shadow disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Ya, Hapus</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
