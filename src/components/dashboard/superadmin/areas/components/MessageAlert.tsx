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
    <div className="mb-6 duration-300 animate-in fade-in slide-in-from-top-4">
      <div
        className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm ${
          message.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10'
            : 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'
        }`}
      >
        {message.type === 'success' ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        )}
        <p
          className={`flex-1 text-sm font-medium ${
            message.type === 'success'
              ? 'text-emerald-800 dark:text-emerald-300'
              : 'text-red-800 dark:text-red-300'
          }`}
        >
          {message.text}
        </p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
