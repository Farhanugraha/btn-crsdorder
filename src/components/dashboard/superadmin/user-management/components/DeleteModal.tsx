import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  isProcessing,
  onConfirm,
  onCancel,
  userName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-scale-up w-full max-w-md transform rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="relative p-6">
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                <AlertTriangle className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Hapus Pengguna
            </h3>

            {userName && (
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                Anda akan menghapus:
              </p>
            )}

            {userName && (
              <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                "{userName}"
              </p>
            )}

            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Tindakan ini tidak dapat dibatalkan. Semua data yang
              terkait dengan pengguna ini akan dihapus secara
              permanen.
            </p>

            {/* Warning Box */}
            <div className="mb-6 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <span className="font-semibold">Peringatan:</span>{' '}
                Data yang sudah dihapus tidak dapat dikembalikan.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:from-red-700 hover:to-red-800 hover:shadow-xl disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Menghapus...</span>
                  </div>
                ) : (
                  'Ya, Hapus'
                )}
              </button>

              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
