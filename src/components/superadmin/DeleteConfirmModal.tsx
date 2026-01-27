'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmModal({
  isOpen,
  userName,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');
      await onConfirm();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 transition-colors duration-300">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Delete User</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 transition-colors duration-300">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-300"
          >
            <X className="w-6 h-6 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 transition-colors duration-300">
              {error}
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 transition-colors duration-300">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 transition-colors duration-300">User to delete:</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{userName}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">
              Are you sure you want to delete <strong>{userName}</strong>? This will:
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 ml-4 transition-colors duration-300">
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-500 mt-0.5">•</span>
                <span>Permanently remove the user account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-500 mt-0.5">•</span>
                <span>Delete all associated user data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-500 mt-0.5">•</span>
                <span>Cannot be recovered</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 transition-colors duration-300">
            <p className="text-sm text-amber-800 dark:text-amber-300 transition-colors duration-300">
              <strong>Note:</strong> Make sure this is the user you want to delete before
              confirming.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-b-2xl transition-colors duration-300">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 dark:bg-red-700 text-white font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}