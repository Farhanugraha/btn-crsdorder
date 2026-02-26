import { CheckCircle, AlertTriangle } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
}

export const Toast = ({ type, message }: ToastProps) => {
  const isSuccess = type === 'success';

  return (
    <div
      className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3.5 shadow-sm ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/40'
          : 'border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/40'
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isSuccess
            ? 'bg-emerald-100 dark:bg-emerald-900/60'
            : 'bg-red-100 dark:bg-red-900/60'
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        )}
      </div>
      <p
        className={`text-sm font-semibold ${
          isSuccess
            ? 'text-emerald-700 dark:text-emerald-300'
            : 'text-red-700 dark:text-red-300'
        }`}
      >
        {message}
      </p>
    </div>
  );
};
