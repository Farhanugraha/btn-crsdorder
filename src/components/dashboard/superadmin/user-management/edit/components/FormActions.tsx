'use client';

import { Save, RotateCcw, Loader2 } from 'lucide-react';

interface FormActionsProps {
  updating: boolean;
  onReset: () => void;
}

export const FormActions = ({
  updating,
  onReset
}: FormActionsProps) => {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="submit"
        disabled={updating}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {updating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={updating}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Form
      </button>
    </div>
  );
};
