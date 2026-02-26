// components/dashboard/superadmin/user-management/components/AlertMessage.tsx

import React from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

// Buat type yang sama dengan AlertState
type AlertType = 'success' | 'error' | null;

interface AlertMessageProps {
  type: AlertType; // Ubah menjadi bisa null
  message: string | null;
  onClose?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  message,
  onClose
}) => {
  // Jika type null atau message null/tidak ada, jangan render apapun
  if (!type || !message) {
    return null;
  }

  const styles = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: (
        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      )
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      icon: (
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
      )
    }
  };

  const style = styles[type as 'success' | 'error'];

  return (
    <div
      className={`animate-slide-down rounded-lg border ${style.border} ${style.bg} p-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {style.icon}
          <p className={`font-medium ${style.text}`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`rounded-lg p-1 transition-colors hover:bg-black/5 ${style.text}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
