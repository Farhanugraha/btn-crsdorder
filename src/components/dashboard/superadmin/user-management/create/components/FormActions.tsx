'use client';

import Link from 'next/link';
import { Save, Loader2 } from 'lucide-react';

interface FormActionsProps {
  loading: boolean;
  role: string;
  selectedDataTypesLength: number;
}

export const FormActions = ({
  loading,
  role,
  selectedDataTypesLength
}: FormActionsProps) => {
  const isAdminWithoutData =
    role === 'admin' && selectedDataTypesLength === 0;

  return (
    <div className="rounded-b-lg border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-2 sm:order-1">
          <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            <span className="text-red-500">*</span> Field wajib diisi
          </p>
        </div>
        <div className="order-1 flex w-full flex-col gap-3 sm:order-2 sm:w-auto sm:flex-row">
          <Link href="/dashboard/user-management" className="w-full">
            <button
              type="button"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Batal
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading || isAdminWithoutData}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
      {isAdminWithoutData && (
        <p className="mt-2 text-center text-xs text-red-600">
          * Data access wajib dipilih untuk role admin
        </p>
      )}
    </div>
  );
};
