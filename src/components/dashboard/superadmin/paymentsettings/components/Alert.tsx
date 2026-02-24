'use client';

import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import type { MessageType } from '../types';

interface Props {
  message: MessageType | null;
  onClose: () => void;
}

export default function Alert({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div className="border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div
        className={`flex items-center gap-2 rounded-lg border p-2 sm:gap-3 sm:p-3 ${
          message.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30'
            : message.type === 'error'
              ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/30'
              : 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/30'
        }`}
      >
        {message.type === 'success' ? (
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400 sm:h-5 sm:w-5" />
        ) : (
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400 sm:h-5 sm:w-5" />
        )}
        <p
          className={`flex-1 text-xs font-medium sm:text-sm ${
            message.type === 'success'
              ? 'text-emerald-800 dark:text-emerald-200'
              : message.type === 'error'
                ? 'text-red-800 dark:text-red-200'
                : 'text-blue-800 dark:text-blue-200'
          }`}
        >
          {message.text}
        </p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
