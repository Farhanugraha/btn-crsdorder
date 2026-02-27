'use client';

import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import type { Message } from '../types';

interface MessageAlertProps {
  message: Message;
  onClose: () => void;
}

export const MessageAlert = ({
  message,
  onClose
}: MessageAlertProps) => {
  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div
        className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
          message.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20'
            : 'border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20'
        }`}
      >
        {message.type === 'success' ? (
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
        )}
        <p
          className={`flex-1 font-medium ${
            message.type === 'success'
              ? 'text-emerald-800 dark:text-emerald-300'
              : 'text-red-800 dark:text-red-300'
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
};
