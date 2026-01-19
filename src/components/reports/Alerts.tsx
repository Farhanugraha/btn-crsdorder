import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export const SuccessAlert = ({
  message,
  onClose
}: SuccessAlertProps) => (
  <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
    <p className="flex-1 text-sm font-medium text-green-800 dark:text-green-300">
      {message}
    </p>
    <button
      onClick={onClose}
      className="text-green-600 hover:text-green-800 dark:text-green-400"
    >
      ✕
    </button>
  </div>
);

export const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => (
  <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
    <p className="flex-1 text-sm font-medium text-red-800 dark:text-red-300">
      {message}
    </p>
    <button
      onClick={onClose}
      className="text-red-600 hover:text-red-800 dark:text-red-400"
    >
      ✕
    </button>
  </div>
);
