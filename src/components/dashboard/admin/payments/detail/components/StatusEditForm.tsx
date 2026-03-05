import React from 'react';
import { Check, X, Save } from 'lucide-react';
import { PAYMENT_MESSAGES } from '../constants';

interface StatusEditFormProps {
  editStatus: string;
  isSaving: boolean;
  onStatusChange: (status: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const StatusEditForm: React.FC<StatusEditFormProps> = ({
  editStatus,
  isSaving,
  onStatusChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-700 dark:to-gray-800">
        <p className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">
          Pilih aksi untuk pembayaran ini:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            onClick={() => onStatusChange('completed')}
            className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              editStatus === 'completed'
                ? 'bg-green-600 text-white shadow-md dark:bg-green-700'
                : 'border-2 border-green-200 bg-white text-green-700 hover:bg-green-50 dark:border-green-700 dark:bg-gray-900 dark:text-green-400 dark:hover:bg-green-900/20'
            }`}
          >
            <Check className="mb-1 inline h-4 w-4" />
            <span className="ml-2">
              {PAYMENT_MESSAGES.CONFIRM_BUTTON}
            </span>
          </button>
          <button
            onClick={() => onStatusChange('rejected')}
            className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              editStatus === 'rejected'
                ? 'bg-red-600 text-white shadow-md dark:bg-red-700'
                : 'border-2 border-red-200 bg-white text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-900/20'
            }`}
          >
            <X className="mb-1 inline h-4 w-4" />
            <span className="ml-2">
              {PAYMENT_MESSAGES.REJECT_BUTTON}
            </span>
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Menyimpan...' : PAYMENT_MESSAGES.SAVE_BUTTON}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {PAYMENT_MESSAGES.CANCEL_BUTTON}
        </button>
      </div>
    </div>
  );
};
